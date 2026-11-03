import { readFile, writeFile, rename } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { mergeAsks } from './import-asks.mjs'

const defaultScriptUrl = 'https://script.google.com/macros/s/AKfycbyjk7AppircS4JkwyP-8Jto8a69MCRhhqhXy4jntSpseqW1cZDMexn3Eq3pO_vIPaBNNQ/exec'

export async function syncAsks({ file = resolve('data/ask.json'), url = defaultScriptUrl, token, fetcher = fetch } = {}) {
  if (!token?.trim()) throw new Error('Set ASK_SYNC_TOKEN to match the Apps Script property.')
  const endpoint = new URL(url)
  if (endpoint.protocol !== 'https:' || endpoint.hostname !== 'script.google.com' || !endpoint.pathname.endsWith('/exec')) {
    throw new Error('ASK_SCRIPT_URL must be an HTTPS script.google.com web app URL ending in /exec.')
  }
  // Send the secret in the POST body, never in a URL or log output.
  let response
  try {
    response = await fetcher(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: new URLSearchParams({ action: 'exportAsks', token }).toString(),
      signal: AbortSignal.timeout(60000),
    })
  } catch {
    throw new Error('Could not contact Apps Script. No changes were saved.')
  }
  if (!response.ok) throw new Error('Apps Script export failed. No changes were saved.')
  let result
  try {
    result = await response.json()
  } catch {
    throw new Error('Apps Script did not return JSON. Check deployment access. No changes were saved.')
  }
  if (!result?.ok || result.sheet !== 'Asks' || !Array.isArray(result.asks)) {
    throw new Error('Export rejected. Check ASK_SYNC_TOKEN and redeploy the updated Apps Script. No changes were saved.')
  }
  const source = await readFile(file, 'utf8')
  const data = JSON.parse(source)
  const merged = mergeAsks(data, result.asks)
  if (JSON.stringify(data) === JSON.stringify(merged)) return false
  await writeFile(`${file}.tmp`, `${JSON.stringify(merged, null, 2)}\n`)
  await rename(`${file}.tmp`, file)
  return true
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const changed = await syncAsks({ url: process.env.ASK_SCRIPT_URL || defaultScriptUrl, token: process.env.ASK_SYNC_TOKEN })
    console.log(changed ? 'New asks imported; existing responses preserved.' : 'No new asks.')
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
