import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const resolveEntryForPkg = (/** @type {string} */ p) =>
  path.resolve(fileURLToPath(import.meta.url), `../../packages/${p}/src/index.ts`)

const dirs = readdirSync(new URL('../packages', import.meta.url))

/** @type {Record<string, string>} */
const entries = {
  cesiumDevkit: resolveEntryForPkg('cesium-devkit')
}

for (const dir of dirs) {
  const key = `@cesium-devkit/${dir}`
  if (
    dir !== 'cesium-devkit' &&
    !(key in entries) &&
    statSync(new URL(`../packages/${dir}`, import.meta.url)).isDirectory()
  ) {
    entries[key] = resolveEntryForPkg(dir)
  }
}

export { entries }
