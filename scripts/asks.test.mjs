import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { mergeAsks } from './import-asks.mjs'
import { listResponses, mergeLiveAsks } from '../src/pages/asks/askData.js'
import { syncAsks } from './sync-asks.mjs'
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const empty = JSON.parse(readFileSync(new URL('../data/ask.json', import.meta.url), 'utf8'))
const ask = { id: 'ask-1', character: 'Skip', time: 'Pre-Update 1', name: '', question: '  Hello?\nHow are you?  ', date: '2026-11-03T14:00:00.000Z' }

test('import groups asks, preserves exact text, and keeps existing responses on repeated imports', () => {
  const imported = mergeAsks(empty, [ask])
  const record = imported.characters.Skip['Pre-Update 1'][0]
  assert.equal(record.question, ask.question)
  assert.equal(listResponses(imported).length, 1)
  assert.equal(listResponses(imported)[0].answered, false)
  record.response = [{ speaker: 'Skip', text: 'Hello!' }]
  const again = mergeAsks(imported, [ask])
  assert.deepEqual(again, imported)
  assert.equal(listResponses(again).length, 1)
  assert.equal(listResponses(again)[0].answered, true)
  assert.equal(listResponses(empty).length, 0)
  assert.throws(() => mergeAsks(empty, [{ ...ask, character: '__proto__' }]))
})

test('live asks appear immediately and committed dialogue is merged by ID', () => {
  const imported = mergeAsks(empty, [ask])
  imported.characters.Skip['Pre-Update 1'][0].response = [{ speaker: 'Skip', text: 'Hi!' }]
  const newer = { ...ask, id: 'ask-2', question: 'A new question', date: '2026-11-03T15:00:00.000Z' }
  const merged = mergeLiveAsks(imported, [ask, newer])
  assert.deepEqual(merged.map(item => [item.id, item.answered]), [['ask-2', false], ['ask-1', true]])
  assert.equal(merged[1].response[0].text, 'Hi!')
})

function sheetScript(syncToken = '') {
  const rows = []
  const context = vm.createContext({
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    Utilities: { getUuid: () => 'ask-1' },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => syncToken }) },
    SpreadsheetApp: {
      flush() {},
      getActiveSpreadsheet: () => ({ getSheetByName: () => ({
        getLastRow: () => rows.length + 1,
        getRange: () => ({ getValues: () => rows, setNumberFormat: () => ({ setValues: values => rows.push(values[0]) }) }),
      }) }),
    },
  })
  vm.runInContext(readFileSync(new URL('../vote-sheet.example.gs', import.meta.url), 'utf8'), context)
  return { context, rows }
}

test('Sheets form submission validates choices and stores literal question, name, ID, and date', () => {
  const { context, rows } = sheetScript()
  const result = context.doPost({ parameter: { action: 'ask', ...ask, question: '=1+1', name: '  Pat  ' } })
  assert.equal(result.ok, true)
  assert.equal(result.sheet, 'Asks')
  assert.equal(rows.length, 1)
  assert.equal(rows[0][0], result.id)
  assert.ok(Number.isFinite(Date.parse(rows[0][1])))
  assert.equal(rows[0][4], 'Pat')
  assert.equal(rows[0][5], "'=1+1")
  assert.equal(context.doPost({ parameter: { action: 'ask', ...ask, time: 'Post-Update 2' } }).ok, false)
  assert.equal(context.doPost({ parameter: { action: 'ask', ...ask, question: ' ' } }).ok, false)
  assert.equal(rows.length, 1)
})

test('Sheets export requires a configured matching key and leaves the health check working', () => {
  const { context, rows } = sheetScript('test-sync-key')
  rows.push([ask.id, ask.date, ask.character, ask.time, ask.name, ask.question])
  assert.equal(context.doGet().ok, true)
  const listed = context.doGet({ parameter: { action: 'listAsks' } })
  assert.equal(listed.ok, true)
  assert.equal(listed.asks[0].id, ask.id)
  for (const token of ['', 'wrong-key']) {
    const result = context.doPost({ parameter: { action: 'exportAsks', token } })
    assert.equal(result.ok, false)
    assert.equal(result.asks, undefined)
  }
  const exported = context.doPost({ parameter: { action: 'exportAsks', token: 'test-sync-key' } })
  assert.equal(exported.ok, true)
  assert.equal(exported.asks[0].question, ask.question)
  assert.equal(sheetScript().context.doPost({ parameter: { action: 'exportAsks', token: 'test-sync-key' } }).ok, false)
})

test('automatic sync imports once, preserves responses, and never changes the file on rejected or invalid exports', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'upro-asks-'))
  const file = join(directory, 'ask.json')
  try {
    await writeFile(file, JSON.stringify(empty))
    const options = { file, token: 'test-sync-key', fetcher: async (url, request) => {
      assert.equal(url.search, '')
      assert.equal(request.method, 'POST')
      assert.equal(new URLSearchParams(request.body).get('token'), 'test-sync-key')
      return { ok: true, json: async () => ({ ok: true, sheet: 'Asks', asks: [ask] }) }
    } }
    assert.equal(await syncAsks(options), true)
    const data = JSON.parse(await readFile(file, 'utf8'))
    data.characters.Skip['Pre-Update 1'][0].response = [{ speaker: 'Skip', text: 'Hi!' }]
    await writeFile(file, JSON.stringify(data))
    const before = await readFile(file, 'utf8')
    assert.equal(await syncAsks(options), false)
    for (const result of [{ ok: false }, { ok: true, sheet: 'Asks', asks: [{ ...ask, id: 'new-ask', character: 'Invalid' }] }]) {
      await assert.rejects(syncAsks({ ...options, fetcher: async () => ({ ok: true, json: async () => result }) }))
      assert.equal(await readFile(file, 'utf8'), before)
    }
    await assert.rejects(syncAsks({ ...options, token: '' }))
    assert.equal(await readFile(file, 'utf8'), before)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
