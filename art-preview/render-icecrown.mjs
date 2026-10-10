// Trial Icecrown Citadel render with Draw Things, prompts in ICECROWN.md.
//   node art-preview/render-icecrown.mjs [tower|base|open ...]   3 versions each
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = new URL('.', import.meta.url).pathname;
const API = process.env.DRAW_THINGS_URL ?? 'http://127.0.0.1:7860';
const md = readFileSync(join(DIR, 'ICECROWN.md'), 'utf8');
const block = (name) => md.split(`## ${name}\n`)[1].split('\n## ')[0].split('\n').filter((l) => l.startsWith('>')).map((l) => l.replace(/^>\s?/, '')).join(' ').trim();
const SIZE = { tower: [640, 1024], base: [1024, 768], open: [1024, 768] };
const parts = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SIZE);

for (const part of parts) {
  for (let v = 1; v <= 3; v++) {
    const [width, height] = SIZE[part];
    const body = { prompt: `${block(part)} ${block('Style')}`, negative_prompt: block('Negative'), width, height, steps: 8, guidance_scale: 2.5, batch_size: 1, seed: 3030 + v * 7919 };
    const res = await fetch(`${API}/sdapi/v1/txt2img`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Draw Things answered ${res.status}: ${await res.text()}`);
    writeFileSync(join(DIR, `icecrown-${part}-${v}.png`), Buffer.from((await res.json()).images[0], 'base64'));
    console.log(`icecrown-${part}-${v}.png`);
  }
}
