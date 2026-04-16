#!/usr/bin/env node
/**
 * convert.js — Convert iPhone images (HEIC/JPG/PNG) to WebP for TuftForest GT
 *
 * Usage:
 *   npm run convert                          # converts images/input/ → public/images/products/
 *   node scripts/convert.js --input path/to/folder
 *   node scripts/convert.js --quality 85    # default: 82
 *   node scripts/convert.js --width 1400    # default: 1200
 *   node scripts/convert.js --dry-run       # preview without writing
 *   node scripts/convert.js --force         # re-convert even if output exists
 *
 * After running, copy the printed filenames into ALL_IMAGES in:
 *   app/components/Catalog.tsx
 *   app/components/Hero.tsx  (optional, for featured rotation)
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const { readdir, readFile, mkdir } = require("fs/promises");
const { existsSync } = require("fs");
const { join, basename, extname } = require("path");
const sharp = require("sharp");
const heicConvert = require("heic-convert");

const ROOT = join(__dirname, "..");

// --- CLI args ---
const args = process.argv.slice(2);
const get = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : fallback;
};
const hasFlag = (flag) => args.includes(flag);

const INPUT_DIR = get("--input", join(ROOT, "images", "input"));
const OUTPUT_DIR = get("--output", join(ROOT, "public", "images", "products"));
const QUALITY = parseInt(get("--quality", "82"), 10);
const MAX_WIDTH = parseInt(get("--width", "1200"), 10);
const DRY_RUN = hasFlag("--dry-run");
const FORCE = hasFlag("--force");

const SUPPORTED = new Set([".heic", ".heif", ".jpg", ".jpeg", ".png"]);

async function convertHeic(buffer) {
  const output = await heicConvert({
    buffer: new Uint8Array(buffer),
    format: "JPEG",
    quality: 1,
  });
  return Buffer.from(output);
}

async function processFile(filePath, outputDir) {
  const ext = extname(filePath).toLowerCase();
  if (!SUPPORTED.has(ext)) return null;

  const stem = basename(filePath, extname(filePath));
  const outName = `${stem}.webp`;
  const outPath = join(outputDir, outName);

  if (!FORCE && existsSync(outPath)) {
    console.log(`  skip     ${outName}  (exists — use --force to overwrite)`);
    return null;
  }

  if (DRY_RUN) {
    console.log(`  [dry]    ${basename(filePath)} → ${outName}`);
    return outName;
  }

  let inputBuffer = await readFile(filePath);

  if (ext === ".heic" || ext === ".heif") {
    process.stdout.write(`  heic→jpg  ${basename(filePath)}... `);
    inputBuffer = await convertHeic(inputBuffer);
    process.stdout.write("ok\n");
  }

  process.stdout.write(`  convert   ${basename(filePath)} → ${outName}... `);
  await sharp(inputBuffer)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(outPath);

  process.stdout.write("ok\n");
  return outName;
}

async function main() {
  if (!existsSync(INPUT_DIR)) {
    console.error(`\nInput folder not found: ${INPUT_DIR}`);
    console.error(`Create it and drop your iPhone images there, then re-run.\n`);
    process.exit(1);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = await readdir(INPUT_DIR);
  const imageFiles = files.filter((f) => SUPPORTED.has(extname(f).toLowerCase()));

  if (imageFiles.length === 0) {
    console.log(`\nNo images found in ${INPUT_DIR}`);
    console.log(`Supported: ${[...SUPPORTED].join(", ")}\n`);
    process.exit(0);
  }

  console.log(`\nTuftForest GT — Image Converter`);
  console.log(`Input:   ${INPUT_DIR}`);
  console.log(`Output:  ${OUTPUT_DIR}`);
  console.log(`Format:  WebP  quality=${QUALITY}  max-width=${MAX_WIDTH}px`);
  console.log(`Files:   ${imageFiles.length} found\n`);

  if (DRY_RUN) console.log("[DRY RUN — no files written]\n");

  const converted = [];
  for (const file of imageFiles) {
    const result = await processFile(join(INPUT_DIR, file), OUTPUT_DIR);
    if (result) converted.push(result);
  }

  if (converted.length === 0) {
    console.log("\nNothing new converted.");
    return;
  }

  console.log(`\n✓ ${converted.length} image(s) converted\n`);
  console.log("── Add to ALL_IMAGES in app/components/Catalog.tsx ──────────────\n");
  console.log(converted.map((f) => `  "${f}",`).join("\n"));
  console.log("\n─────────────────────────────────────────────────────────────────\n");
}

main().catch((err) => {
  console.error("\nError:", err.message);
  process.exit(1);
});
