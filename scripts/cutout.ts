/**
 * Knock the flat backdrop out of the world sprite PNGs so they sit in the
 * overworld as clean transparent cutouts (no ugly boxes).
 *
 * The sprite art is generated on a flat studio backdrop (a vivid green screen
 * for the warm characters, a flat magenta/rose for the green-stemmed plants).
 * Rather than assume one colour, this auto-detects the backdrop from the border
 * pixels, then flood-fills the background inward from the edges: only backdrop-
 * coloured pixels CONNECTED to the border are removed, so same-coloured details
 * inside the subject (white socks, a cream shirt) are preserved. Edges are
 * feathered and green spill is suppressed.
 *
 * Idempotent: a file that already has transparency is skipped unless --force.
 *
 * Usage:
 *   npm run cutout
 *   npm run cutout -- --force
 *   npm run cutout -- --only waldo
 */

import { PNG } from 'pngjs';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Each group is a subfolder of assets/illustrations whose sprites are generated
// on a flat backdrop. (world.bg is intentionally excluded so it stays opaque.)
const GROUPS: { dir: string; keys: string[] }[] = [
  { dir: 'world', keys: ['mia', 'waldo', 'rosie', 'biscuit', 'ruby', 'bea', 'sprout', 'flower.a', 'flower.b', 'flower.c'] },
  { dir: 'treasure', keys: ['shell', 'leaf', 'acorn', 'pebble', 'feather', 'berry', 'pinecone', 'stone'] },
];

// Euclidean colour distance to the detected backdrop. The flood only spreads
// through pixels within FLOOD of the backdrop, so a near-backdrop subject (a
// light-pink pig on white) isn't eaten. Within the flooded region, alpha ramps
// from fully transparent (<= TOL_LOW) to opaque (>= FLOOD), feathering the edge.
const TOL_LOW = 34;
const FLOOD = 62;

const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

const median = (xs: number[]): number => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)]!;
};

const hasTransparency = (data: Buffer): boolean => {
  for (let i = 3; i < data.length; i += 4 * 40) if (data[i]! < 250) return true;
  return false;
};

const cutout = (png: { width: number; height: number; data: Buffer }) => {
  const { width: w, height: h, data } = png;

  // Detect backdrop from a ring of border pixels (median is robust to a subject
  // that touches an edge).
  const rs: number[] = [];
  const gs: number[] = [];
  const bs: number[] = [];
  const sample = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    rs.push(data[i]!);
    gs.push(data[i + 1]!);
    bs.push(data[i + 2]!);
  };
  for (let x = 0; x < w; x += 6) {
    sample(x, 1);
    sample(x, h - 2);
  }
  for (let y = 0; y < h; y += 6) {
    sample(1, y);
    sample(w - 2, y);
  }
  const bg = [median(rs), median(gs), median(bs)];

  const dist = (i: number) => {
    const dr = data[i]! - bg[0]!;
    const dg = data[i + 1]! - bg[1]!;
    const db = data[i + 2]! - bg[2]!;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  // Flood the background inward from every border pixel.
  const N = w * h;
  const isBg = new Uint8Array(N);
  const stack: number[] = [];
  const pushIf = (p: number) => {
    if (!isBg[p] && dist(p * 4) < FLOOD) {
      isBg[p] = 1;
      stack.push(p);
    }
  };
  for (let x = 0; x < w; x++) {
    pushIf(x);
    pushIf((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    pushIf(y * w);
    pushIf(y * w + (w - 1));
  }
  while (stack.length) {
    const p = stack.pop()!;
    const x = p % w;
    const y = (p / w) | 0;
    if (x > 0) pushIf(p - 1);
    if (x < w - 1) pushIf(p + 1);
    if (y > 0) pushIf(p - w);
    if (y < h - 1) pushIf(p + w);
  }

  const greenBg = bg[1]! > bg[0]! && bg[1]! > bg[2]!;
  for (let p = 0; p < N; p++) {
    const i = p * 4;
    if (!isBg[p]) {
      data[i + 3] = 255;
      continue;
    }
    const d = dist(i);
    const alpha = d <= TOL_LOW ? 0 : d >= FLOOD ? 255 : Math.round((255 * (d - TOL_LOW)) / (FLOOD - TOL_LOW));
    data[i + 3] = alpha;
    // Suppress green spill on feathered edges of a green-screened sprite.
    if (alpha > 0 && alpha < 255 && greenBg) {
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const cap = Math.max(r, b);
      if (g > cap) data[i + 1] = cap + Math.round((g - cap) * 0.25);
    }
  }
};

let done = 0;
let skipped = 0;

for (const g of GROUPS) {
  for (const key of g.keys) {
    if (only && key !== only) continue;
    const file = join(process.cwd(), 'assets', 'illustrations', g.dir, `${key}.png`);
    if (!existsSync(file)) {
      console.log(`  · skip (missing) ${g.dir}/${key}`);
      continue;
    }
    const png = PNG.sync.read(readFileSync(file));
    if (!force && hasTransparency(png.data)) {
      skipped++;
      console.log(`  · skip (already cut) ${g.dir}/${key}`);
      continue;
    }
    cutout(png);
    writeFileSync(file, PNG.sync.write(png));
    done++;
    console.log(`  ✓ cutout ${g.dir}/${key}`);
  }
}

console.log(`\nCut out ${done}, skipped ${skipped}.`);
console.log('Next: npm run generate:manifests, then restart Metro with --clear.');
