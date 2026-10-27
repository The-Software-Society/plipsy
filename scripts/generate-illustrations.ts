/**
 * Generate scene + cover + character expression illustrations for the stories
 * via @google/genai.
 *
 * MODEL: the original 105 illustrations were made with Imagen 4 (`generateImages`
 * / predict). Google SHUT DOWN all three Imagen 4 GA endpoints on 2026-08-17;
 * any imagen-* id now 404s with NOT_FOUND on every key. The documented
 * replacement is `gemini-3.1-flash-image`, which goes through `generateContent`
 * with an IMAGE response modality. Both call shapes are still supported here and
 * picked from the MODEL name, so the Imagen path is kept only for reference.
 *
 * Style note: Gemini image models do NOT reproduce the Imagen look on prompt
 * alone. See the media-generation memory before generating new story art.
 *
 * Usage:
 *   npm run generate:illustrations
 *   npm run generate:illustrations -- --force
 *   npm run generate:illustrations -- --scene cat.s1
 *   npm run generate:illustrations -- --story cat   # only images one story uses
 */

import { config as loadEnv } from 'dotenv';
loadEnv({ path: ['.env.local', '.env'] });

import { GoogleGenAI } from '@google/genai';
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { illustrationPrompts } from './illustration-prompts';
import { getStory } from '../src/stories';

// Two tiers. Scenes and covers carry the lighting, depth and composition that
// the pro model is visibly better at. Icons, character cutouts and other flat
// single-subject art sit on plain ground where that fidelity does not show, so
// they take the cheap model at a quarter of the price ($0.134 vs $0.0336 per
// 1K image). The bulk of the catalog is sprites, so most of it runs cheap.
const PRO_MODEL = 'gemini-3-pro-image';
const LITE_MODEL = 'gemini-3.1-flash-lite-image';

// The imagen-* path is dead as of 2026-08-17, kept only as a reference impl.
const isImagen = (model: string) => model.startsWith('imagen');
const OUTPUT_DIR = join(process.cwd(), 'assets', 'illustrations');
const STYLE_PATH = join(process.cwd(), 'scripts', 'style-prompt.md');

const PACE_MS = 6500;
const MAX_RETRIES = 5;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const args = process.argv.slice(2);
const force = args.includes('--force');
const sceneIdx = args.indexOf('--scene');
const onlyKey = sceneIdx >= 0 ? args[sceneIdx + 1] : null;
const storyIdx = args.indexOf('--story');
const onlyStory = storyIdx >= 0 ? args[storyIdx + 1] : null;
const modelIdx = args.indexOf('--model');
const modelOverride = modelIdx >= 0 ? args[modelIdx + 1]! : null;

const modelFor = (key: string): string => {
  if (modelOverride) return modelOverride;
  if (key === 'world.bg') return PRO_MODEL; // a full detailed map, not a sprite
  if (key.endsWith('.expression')) return LITE_MODEL; // single character, flat ground
  if (key.startsWith('choice.') || key.startsWith('world.') || key.startsWith('treasure.')) {
    return LITE_MODEL;
  }
  return PRO_MODEL; // <story>.cover and <story>.sN
};

// Style locking. The original art was made with Imagen 4, which is retired, and
// no Gemini image model reproduces that look from the text prompt alone (it
// drifts painterly, adds a white border, and redraws Mia's face). Attaching a
// few approved illustrations as reference parts fixes framing, palette and
// character design. Scenes reference scenes; icons reference icons.
const SCENE_REFS = ['fan/s1.png', 'cat/s4.png', 'pat/s3a.png'];
const CHOICE_REFS = ['choice/hat.png', 'choice/can.png', 'choice/fan.png'];

// world.*/treasure.* are painted on a flat white backdrop so `npm run cutout`
// can key them transparent. Reference images override that, so they get none.
const refsFor = (key: string): string[] => {
  if (key.startsWith('world.') || key.startsWith('treasure.')) return [];
  if (key.startsWith('choice.')) return CHOICE_REFS;
  return SCENE_REFS;
};

const sceneLock = `The attached images are EXISTING illustrations from this children's book. Draw a
new illustration for the same book that is indistinguishable in style from them:
the same linework weight, the same muted cream / sage / terracotta palette, the
same paper grain, the same soft even lighting. Do not brighten or saturate the
palette. Copy the recurring characters exactly as drawn in the references.

CRITICAL: the illustration must fill the entire square frame, edge to edge. Do
NOT draw a white border, a frame, a vignette, a mount, or any inset panel.`;

const choiceLock = `The attached images are EXISTING icons from this children's book. Draw a new icon
in exactly the same style: one simple object, centered, isolated on the same soft
cream ground, same linework weight and muted palette, no scenery and no border.

Match their SCALE: the object is large in frame, filling roughly half the image
width and sitting centered both horizontally and vertically. Do not draw it small
or float it in a large empty field.`;

// All illustration keys a single story references (cover, scenes, spell
// expressions, and choice icons).
const keysForStory = (storyId: string): Set<string> => {
  const story = getStory(storyId);
  const keys = new Set<string>();
  if (!story) return keys;
  keys.add(story.cover);
  for (const scene of Object.values(story.scenes)) {
    keys.add(scene.illustration);
    const e = scene.end;
    if (e.type === 'spellOut' || e.type === 'spellInteractive') keys.add(e.expressionIllustration);
    if (e.type === 'choice') for (const opt of e.options) keys.add(opt.illustration);
  }
  return keys;
};

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error('Missing GOOGLE_API_KEY in environment');
  process.exit(1);
}

const styleFile = readFileSync(STYLE_PATH, 'utf8');

const stylePrefix = styleFile.split('## Style prefix')[1]!.split('## Locked')[0]!.trim();

// Parse the locked character descriptions into a map keyed by their heading
// (e.g. "mia", "the cat"). Only the characters mentioned in a given scene's
// prompt are inlined - otherwise the model draws every character at once.
const charBlocks: Record<string, string> = {};
const charSection = styleFile.split('## Locked character descriptions')[1] ?? '';
for (const chunk of charSection.split('### ').slice(1)) {
  const nl = chunk.indexOf('\n');
  if (nl < 0) continue;
  charBlocks[chunk.slice(0, nl).trim().toLowerCase()] = chunk.slice(nl + 1).trim();
}

const charactersFor = (suffix: string): string[] => {
  const low = suffix.toLowerCase();
  const picked: string[] = [];
  if (/\bmia\b/.test(low) && charBlocks['mia']) picked.push(charBlocks['mia']!);
  if (/\b(cat|kitten)\b/.test(low) && charBlocks['the cat']) picked.push(charBlocks['the cat']!);
  if (/\bdog\b/.test(low) && charBlocks['the dog']) picked.push(charBlocks['the dog']!);
  if (/\b(dinosaur|dino)\b/.test(low) && charBlocks['the dinosaur'])
    picked.push(charBlocks['the dinosaur']!);
  return picked;
};

const buildPrompt = (key: string, suffix: string): string => {
  const chars = charactersFor(suffix);
  const parts: string[] = [];
  if (refsFor(key).length > 0) {
    parts.push(key.startsWith('choice.') ? choiceLock : sceneLock, '');
  }
  parts.push(stylePrefix);
  if (chars.length > 0) {
    parts.push('', 'Character reference (draw only these characters):', chars.join('\n\n'));
  }
  parts.push('', '## Scene', suffix);
  return parts.join('\n');
};

const pathFor = (key: string): string => {
  // key shape: <story>.<scene>  OR  choice.<word>
  const [first, ...rest] = key.split('.');
  if (first === 'choice') return join(OUTPUT_DIR, 'choice', `${rest.join('.')}.png`);
  return join(OUTPUT_DIR, first!, `${rest.join('.')}.png`);
};

const retryDelayMs = (err: unknown): number | null => {
  const msg = (err as Error)?.message ?? '';
  if (!/429|RESOURCE_EXHAUSTED|quota/i.test(msg)) return null;
  const m = msg.match(/retry(?:Delay)?["':\s]+(\d+(?:\.\d+)?)s/i);
  return m ? Math.ceil(parseFloat(m[1]!) * 1000) + 1000 : 40_000;
};

const main = async () => {
  const ai = new GoogleGenAI({ apiKey });

  const storyKeys = onlyStory ? keysForStory(onlyStory) : null;
  const entries = Object.entries(illustrationPrompts).filter(
    ([key]) => (!onlyKey || key === onlyKey) && (!storyKeys || storyKeys.has(key))
  );

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  // Imagen returns images from a dedicated predict endpoint; Gemini image
  // models return them as inline_data parts on a normal generateContent call.
  const callImagen = async (model: string, prompt: string): Promise<Buffer> => {
    const response = await ai.models.generateImages({
      model,
      prompt,
      config: { numberOfImages: 1, aspectRatio: '1:1' },
    });
    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!imageBytes) throw new Error('no image bytes returned');
    return Buffer.from(imageBytes, 'base64');
  };

  const callGemini = async (model: string, prompt: string, refs: string[]): Promise<Buffer> => {
    const refParts = refs.map((r) => ({
      inlineData: {
        mimeType: 'image/png',
        data: readFileSync(join(OUTPUT_DIR, r)).toString('base64'),
      },
    }));
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [...refParts, { text: prompt }] }],
      config: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: '1:1' },
      },
    });
    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      const data = part.inlineData?.data;
      if (data) return Buffer.from(data, 'base64');
    }
    const finish = response.candidates?.[0]?.finishReason;
    throw new Error(`no image bytes returned${finish ? ` (finishReason: ${finish})` : ''}`);
  };

  const generateImage = async (key: string, prompt: string): Promise<Buffer> => {
    const model = modelFor(key);
    const refs = isImagen(model) ? [] : refsFor(key);
    for (let attempt = 0; ; attempt++) {
      try {
        return isImagen(model)
          ? await callImagen(model, prompt)
          : await callGemini(model, prompt, refs);
      } catch (e) {
        const wait = retryDelayMs(e);
        if (wait == null || attempt >= MAX_RETRIES) throw e;
        console.log(`    … rate limited, waiting ${Math.round(wait / 1000)}s (retry ${attempt + 1}/${MAX_RETRIES})`);
        await sleep(wait);
      }
    }
  };

  for (const [key, suffix] of entries) {
    const path = pathFor(key);
    if (!force && existsSync(path)) {
      skipped++;
      continue;
    }
    try {
      mkdirSync(dirname(path), { recursive: true });
      const buf = await generateImage(key, buildPrompt(key, suffix));
      writeFileSync(path, buf);
      generated++;
      const tier = modelFor(key) === PRO_MODEL ? 'pro ' : 'lite';
      console.log(`  ✓ ${key}  [${tier}] (${Math.round(buf.length / 1024)} KB)`);
      await sleep(PACE_MS);
    } catch (e) {
      failed++;
      console.error(`  ✗ ${key}: ${(e as Error).message}`);
    }
  }

  console.log(`\nGenerated ${generated}, skipped ${skipped}, failed ${failed}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Next: npm run generate:manifests`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
