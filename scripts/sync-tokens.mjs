#!/usr/bin/env node
/*
 * sync-tokens.mjs — Embassy is the single source of truth for design tokens.
 *
 * Embassy's css/variables.css is canonical (authored here; loaded by index.html and
 * read by the design-system skill). The @amalgama/ds package (packages/ds/)
 * must ship its OWN copy so it's self-contained for external npm consumers — but that copy
 * is a DERIVED ARTIFACT, never hand-edited. This script keeps it in sync.
 *
 * Usage:
 *   node scripts/sync-tokens.mjs           # copy Embassy variables.css → TW package (apply)
 *   node scripts/sync-tokens.mjs --check   # exit 1 if they differ (CI / pre-publish guard)
 *
 * Override the package path with TW_REPO.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const SRC = join(HERE, '..', 'css', 'variables.css')               // Embassy = canonical
const PKG = process.env.DS_PKG || join(HERE, '..', 'packages', 'ds')
const DST = join(PKG, 'css', 'variables.css')                      // package copy (derived)

const check = process.argv.includes('--check')

if (!existsSync(SRC)) { console.error(`✗ canonical tokens not found: ${SRC}`); process.exit(1) }
if (!existsSync(DST)) { console.error(`✗ package tokens not found: ${DST}\n  set DS_PKG to the package path.`); process.exit(1) }

const src = readFileSync(SRC, 'utf8')
const dst = readFileSync(DST, 'utf8')
const inSync = src === dst

if (check) {
  if (inSync) { console.log('✅ tokens in sync (Embassy css/variables.css == @amalgama/ds css/variables.css)'); process.exit(0) }
  console.error('❌ tokens DRIFTED — @amalgama/ds css/variables.css differs from Embassy.\n   Run `node scripts/sync-tokens.mjs` to regenerate it from the canonical source.')
  process.exit(1)
}

if (inSync) { console.log('✅ already in sync — nothing to copy.'); process.exit(0) }
writeFileSync(DST, src)
console.log(`✅ synced Embassy css/variables.css → ${DST}`)
