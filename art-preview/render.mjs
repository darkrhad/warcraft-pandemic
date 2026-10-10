// One trial hero render with Draw Things (local, free), same HTTP API as clank-demo's make-art.
//   node art-preview/render.mjs            4 versions of the prompt in PROMPT.md
//   node art-preview/render.mjs --seed 7   other seeds = other pictures
// Needs Draw Things open with its API server (HTTP, port 7860) and an SDXL model loaded.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = new URL('.', import.meta.url).pathname;
const API = process.env.DRAW_THINGS_URL ?? 'http://127.0.0.1:7860';
const md = readFileSync(join(DIR, 'PROMPT.md'), 'utf8');
const block = (name) => md.split(`## ${name}`)[1].split('\n## ')[0].split('\n').filter((l) => l.startsWith('>')).map((l) => l.replace(/^>\s?/, '')).join(' ').trim();
const prompt = `${block('Hero')} ${block('Style')}`;
const negative = block('Negative');
const seedAt = process.argv.indexOf('--seed');
const seed = seedAt > 0 ? Number(process.argv[seedAt + 1]) : 2026;

for (let v = 1; v <= 4; v++) {
  const t = Date.now();
  const body = { prompt, negative_prompt: negative, width: 768, height: 1024, steps: 8, guidance_scale: 2.5, batch_size: 1, seed: seed + v * 7919 };
  const res = await fetch(`${API}/sdapi/v1/txt2img`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Draw Things answered ${res.status}: ${await res.text()}`);
  writeFileSync(join(DIR, `tirion-${v}.png`), Buffer.from((await res.json()).images[0], 'base64'));
  console.log(`tirion-${v}.png ${((Date.now() - t) / 1000).toFixed(0)}s`);
}
