/**
 * Generate narration audio for every audio key referenced by the stories,
 * using Google Gemini text-to-speech (via @google/genai). Output is 24kHz
 * mono PCM wrapped into WAV files in assets/audio/. Idempotent: skips files
 * that already exist unless --force is passed.
 *
 * Usage:
 *   npm run generate:audio                  # only missing files
 *   npm run generate:audio -- --force       # regenerate everything
 *   npm run generate:audio -- --only cat    # only keys whose prefix matches
 *   npm run generate:audio -- --story cat   # only audio used by one story
 *
 * Free-tier Gemini TTS allows ~10 requests/minute, so requests are paced and
 * retried on HTTP 429 (honoring the server's retryDelay).
 *
 * Requires GOOGLE_API_KEY (read from .env.local or .env).
 */

import { config as loadEnv } from 'dotenv';
loadEnv({ path: ['.env.local', '.env'] });

import { GoogleGenAI } from '@google/genai';
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { collectAudioJobs, AudioJob } from './audio-prompts';

// A warm, calm female prebuilt voice. Swap for another Gemini voice name
// (e.g. 'Kore', 'Aoede', 'Callirrhoe') to change the storyteller.
const VOICE = 'Leda';
const MODEL = 'gemini-2.5-flash-preview-tts';
const OUTPUT_DIR = join(process.cwd(), 'assets', 'audio');

const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyIdx = args.indexOf('--only');
const onlyPrefix = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
const storyIdx = args.indexOf('--story');
const onlyStory = storyIdx >= 0 ? args[storyIdx + 1] : undefined;

// Pace requests to stay under the free-tier 10 req/min limit (~6.5s each).
const PACE_MS = 6500;
const MAX_RETRIES = 5;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error('Missing GOOGLE_API_KEY in environment (.env.local or .env)');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// A short natural-language directive steers Gemini TTS delivery.
const styleFor = (job: AudioJob): string => {
  if (job.style) return job.style; // per-job override (e.g. phoneme anchoring)
  if (job.hero) return 'Say warmly, slowly, and with delight: ';
  if (job.key.startsWith('bank.name.')) {
    return 'Read this single letter aloud by its name only, nothing else, no extra words: ';
  }
  if (job.key.startsWith('bank.sound.')) {
    return 'Say only this short letter sound, crisp and quick for a small child, no other words: ';
  }
  if (job.key.startsWith('bank.')) {
    return 'Say warmly and encouragingly for a small child: ';
  }
  if (job.key.startsWith('letter.')) {
    return 'Say slowly and clearly, teaching a small child this letter sound: ';
  }
  return 'Say in a warm, calm, gentle storybook voice for a small child: ';
};

// Wrap signed-16-bit little-endian mono PCM into a minimal WAV container.
const wavFromPcm = (pcm: Buffer, sampleRate: number): Buffer => {
  const channels = 1;
  const bits = 16;
  const blockAlign = (channels * bits) / 8;
  const byteRate = sampleRate * blockAlign;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bits, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
};

const rateFromMime = (mime: string | undefined): number => {
  const m = mime?.match(/rate=(\d+)/);
  return m ? parseInt(m[1]!, 10) : 24000;
};

// Longest we'll wait on a rate-limit retry. Per-minute limits resolve in
// seconds; a multi-minute delay means the DAILY quota is exhausted - fail fast
// rather than sleeping for hours.
const MAX_RETRY_WAIT_MS = 120_000;

const retryDelayMs = (err: unknown): number | null => {
  const msg = (err as Error)?.message ?? '';
  if (!/429|RESOURCE_EXHAUSTED|quota/i.test(msg)) return null;
  const m = msg.match(/retry(?:Delay)?["':\s]+(\d+(?:\.\d+)?)s/i);
  const wait = m ? Math.ceil(parseFloat(m[1]!) * 1000) + 1000 : 40_000;
  return wait > MAX_RETRY_WAIT_MS ? null : wait; // daily quota → give up this run
};

const generateOnce = async (job: AudioJob): Promise<Buffer> => {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ parts: [{ text: styleFor(job) + job.text }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } },
      },
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  const data = part?.inlineData?.data;
  if (!data) throw new Error('no audio data returned');
  const pcm = Buffer.from(data, 'base64');
  return wavFromPcm(pcm, rateFromMime(part?.inlineData?.mimeType));
};

const generate = async (job: AudioJob): Promise<Buffer> => {
  for (let attempt = 0; ; attempt++) {
    try {
      return await generateOnce(job);
    } catch (e) {
      if (attempt >= MAX_RETRIES) throw e;
      const rate = retryDelayMs(e);
      if (rate != null) {
        console.log(`    … rate limited, waiting ${Math.round(rate / 1000)}s (retry ${attempt + 1}/${MAX_RETRIES})`);
        await sleep(rate);
        continue;
      }
      // Short inputs occasionally come back empty - retry after a brief pause.
      if (/no audio data/i.test((e as Error).message)) {
        console.log(`    … empty response, retrying (${attempt + 1}/${MAX_RETRIES})`);
        await sleep(2500);
        continue;
      }
      throw e;
    }
  }
};

const main = async () => {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const jobs = collectAudioJobs(onlyStory).filter((j) => !onlyPrefix || j.key.startsWith(onlyPrefix));

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const job of jobs) {
    const path = join(OUTPUT_DIR, `${job.key}.wav`);
    if (!force && existsSync(path)) {
      skipped++;
      continue;
    }
    try {
      mkdirSync(dirname(path), { recursive: true });
      const wav = await generate(job);
      writeFileSync(path, wav);
      generated++;
      console.log(`  ✓ ${job.key}  (${wav.length} bytes)`);
      // Pace to stay under the free-tier per-minute limit.
      await sleep(PACE_MS);
    } catch (e) {
      failed++;
      console.error(`  ✗ ${job.key}: ${(e as Error).message}`);
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
