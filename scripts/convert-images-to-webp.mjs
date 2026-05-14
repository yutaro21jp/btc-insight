import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const projectRoot = path.resolve(new URL('..', import.meta.url).pathname)
const publicImagesDir = path.join(projectRoot, 'public', 'images')
const quality = 82
const sourceExtensions = new Set(['.jpg', '.jpeg', '.png'])

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return walk(fullPath)
      return fullPath
    }),
  )

  return files.flat()
}

async function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const files = (await walk(publicImagesDir)).filter((file) =>
  sourceExtensions.has(path.extname(file).toLowerCase()),
)

if (!files.length) {
  console.log('No jpg/jpeg/png images found under public/images.')
  process.exit(0)
}

console.log(`Converting ${files.length} image(s) to WebP at quality ${quality}.`)

for (const sourcePath of files) {
  const parsed = path.parse(sourcePath)
  const outputPath = path.join(parsed.dir, `${parsed.name}.webp`)

  await sharp(sourcePath)
    .rotate()
    .webp({ quality })
    .toFile(outputPath)

  const [sourceStat, outputStat, metadata] = await Promise.all([
    fs.stat(sourcePath),
    fs.stat(outputPath),
    sharp(outputPath).metadata(),
  ])

  const relativeSource = path.relative(projectRoot, sourcePath)
  const relativeOutput = path.relative(projectRoot, outputPath)
  console.log(
    `${relativeSource} -> ${relativeOutput} (${metadata.width}x${metadata.height}, ${await formatBytes(sourceStat.size)} -> ${await formatBytes(outputStat.size)})`,
  )
}
