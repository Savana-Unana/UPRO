import { copyFile, cp, mkdir } from 'node:fs/promises'

const staticDirs = ['assets', 'data']

await mkdir('dist', { recursive: true })

for (const dir of staticDirs) {
  await cp(dir, `dist/${dir}`, {
    recursive: true,
    force: true,
  })
}

await copyFile('dist/index.html', 'dist/404.html')
