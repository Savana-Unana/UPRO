import { readFile, writeFile, rename } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { characters, times } from '../src/pages/asks/askData.js'

export function mergeAsks(data, asks) {
  if (!Array.isArray(asks)) throw new Error('Expected an array exported from the Asks spreadsheet.')
  const result = structuredClone(data)
  const ids = new Set(Object.values(result.characters).flatMap(periods => Object.values(periods).flat().map(ask => ask.id)))
  for (const ask of asks) {
    if (!ask || typeof ask.id !== 'string' || !ask.id || !characters.includes(ask.character) || !times.includes(ask.time)
      || typeof ask.question !== 'string' || !ask.question.trim() || typeof ask.name !== 'string' || !Number.isFinite(Date.parse(ask.date))) {
      throw new Error('Invalid ask in exported data. No changes were saved.')
    }
    if (ids.has(ask.id)) continue
    result.characters[ask.character] ||= {}
    result.characters[ask.character][ask.time] ||= []
    result.characters[ask.character][ask.time].push({ id: ask.id, name: ask.name, question: ask.question, date: ask.date, response: [] })
    ids.add(ask.id)
  }
  return result
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (!process.argv[2]) throw new Error('Usage: npm run asks:import -- path/to/ask-inbox.json')
  const file = resolve('data/ask.json')
  const data = JSON.parse(await readFile(file, 'utf8'))
  const asks = JSON.parse(await readFile(resolve(process.argv[2]), 'utf8'))
  const merged = mergeAsks(data, asks)
  await writeFile(`${file}.tmp`, `${JSON.stringify(merged, null, 2)}\n`)
  await rename(`${file}.tmp`, file)
  console.log('Imported asks into data/ask.json; existing responses were preserved.')
}
