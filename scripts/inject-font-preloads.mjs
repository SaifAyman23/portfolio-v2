import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const BASE = process.env.DEPLOY_BASE ?? '/portfolio/v2/82aef4670d91c655bab1e9f5f3e3f536/'

const FONTS = [
  'src/assets/fonts/Cyberform.woff2',
  'src/assets/fonts/JetBrainsMono-Variable.woff2',
  'src/assets/fonts/Inter-Variable.woff2',
]

const dist = path.resolve(process.cwd(), 'dist')
const manifestPath = path.join(dist, '.vite', 'manifest.json')

if (!existsSync(manifestPath)) {
  console.error('manifest.json not found — build must run with build.manifest = true')
  process.exit(1)
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

const links = FONTS.map((key) => {
  const entry = manifest[key]
  if (!entry) {
    console.warn('font not in manifest, skipping:', key)
    return null
  }
  return `    <link rel="preload" as="font" type="font/woff2" crossorigin href="${BASE}${entry.file}" />`
}).filter(Boolean)

if (links.length === 0) {
  console.warn('no font preloads injected')
  process.exit(0)
}

for (const name of ['index.html', '404.html']) {
  const target = path.join(dist, name)
  if (!existsSync(target)) continue
  let html = readFileSync(target, 'utf8')
  if (html.includes('rel="preload" as="font"')) {
    console.log(`${name} already has font preloads, skipping`)
    continue
  }
  html = html.replace('<meta charset="utf-8" />', `<meta charset="utf-8" />\n${links.join('\n')}`)
  writeFileSync(target, html)
  console.log(`${name}: injected ${links.length} font preloads`)
}

rmSync(path.join(dist, '.vite'), { recursive: true, force: true })
