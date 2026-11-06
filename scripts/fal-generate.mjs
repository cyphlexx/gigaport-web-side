// Budget-guarded fal.ai generator. Usage:
//   node --env-file=.env.local scripts/fal-generate.mjs image <id> [<id> ...]
//   node --env-file=.env.local scripts/fal-generate.mjs video <id>
// Hard caps: 15 images, 5 videos (whole project). Ledger: ../docs/fal-usage.json
import { fal } from "@fal-ai/client";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const CAPS = { image: 15, video: 5 };
const ROOT = path.resolve(import.meta.dirname, "..");
const LEDGER = path.resolve(ROOT, "docs/fal-usage.json");
const OUT_DIR = path.join(ROOT, "public/media");
const { images: IMAGE_PROMPTS, videos: VIDEO_PROMPTS, style } = JSON.parse(
  await readFile(path.join(import.meta.dirname, "fal-prompts.json"), "utf8"),
);

const [kind, ...ids] = process.argv.slice(2);
if (!["image", "video"].includes(kind) || ids.length === 0) {
  console.error("usage: fal-generate.mjs image|video <id...>");
  process.exit(1);
}
if (!process.env.FAL_KEY) throw new Error("FAL_KEY missing (.env.local)");
fal.config({ credentials: process.env.FAL_KEY });

const ledger = existsSync(LEDGER)
  ? JSON.parse(await readFile(LEDGER, "utf8"))
  : { image: 0, video: 0, log: [] };

if (ledger[kind] + ids.length > CAPS[kind]) {
  console.error(
    `BUDGET: ${kind} used ${ledger[kind]}/${CAPS[kind]}, requested ${ids.length}. Refusing.`,
  );
  process.exit(2);
}

await mkdir(OUT_DIR, { recursive: true });
const saveLedger = () => writeFile(LEDGER, JSON.stringify(ledger, null, 2));

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
}

async function genImage(id) {
  const p = IMAGE_PROMPTS[id];
  if (!p) throw new Error(`unknown image id ${id}`);
  const { data } = await fal.subscribe("fal-ai/nano-banana-pro", {
    input: {
      prompt: `${p.prompt} ${style}`,
      aspect_ratio: p.aspect,
      resolution: "2K",
      output_format: "jpeg",
      num_images: 1,
    },
  });
  // fal bills only completed generations: count right after a successful response
  ledger.image += 1;
  ledger.log.push({ kind: "image", id, at: new Date().toISOString() });
  await saveLedger();
  const file = path.join(OUT_DIR, `${id}.jpg`);
  await download(data.images[0].url, file);
  console.log(`ok image ${id} -> ${path.relative(ROOT, file)}`);
}

async function genVideo(id) {
  const v = VIDEO_PROMPTS[id];
  if (!v) throw new Error(`unknown video id ${id}`);
  const src = path.join(OUT_DIR, `${v.from}.jpg`);
  const startUrl = await fal.storage.upload(
    new Blob([await readFile(src)], { type: "image/jpeg" }),
  );
  const { data } = await fal.subscribe("fal-ai/kling-video/v3/pro/image-to-video", {
    input: {
      start_image_url: startUrl,
      prompt: v.prompt,
      duration: "5",
      generate_audio: false,
      negative_prompt:
        "blur, distort, low quality, camera shake, morphing hands, extra fingers, text, logo",
    },
  });
  ledger.video += 1;
  ledger.log.push({ kind: "video", id, at: new Date().toISOString() });
  await saveLedger();
  const file = path.join(OUT_DIR, `${id}.mp4`);
  await download(data.video.url, file);
  console.log(`ok video ${id} -> ${path.relative(ROOT, file)}`);
}

const run = kind === "image" ? genImage : genVideo;
const results = await Promise.allSettled(ids.map((id) => run(id)));
results.forEach((r, i) => {
  if (r.status === "rejected") console.error(`FAIL ${ids[i]}:`, r.reason?.status, r.reason?.message, JSON.stringify(r.reason?.body ?? r.reason?.cause ?? String(r.reason)));
});
console.log(`budget: images ${ledger.image}/${CAPS.image}, videos ${ledger.video}/${CAPS.video}`);
