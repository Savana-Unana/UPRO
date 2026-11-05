import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

test('vote results sort by calculated percentage', () => {
  const context = vm.createContext({})
  vm.runInContext(readFileSync(new URL('../vote-sheet.example.gs', import.meta.url), 'utf8'), context)

  const existing = [
    ['Popular', 90, 100, '90.00%'],
    ['Perfect', 10, 10, 1],
    ['Alpha', 9, 10, 0.9],
    ['Beta', 9, 10, '90.00%'],
    ['Unvoted', 0, 0, '0.00%'],
  ]
  let written
  const sheet = {
    getLastRow: () => existing.length + 1,
    getMaxRows: () => existing.length + 1,
    getRange: () => ({
      getValues: () => existing,
      setValues: values => { written = JSON.parse(JSON.stringify(values)) },
    }),
  }

  context.writeVoteRows_(sheet, context.readVoteRows_(sheet))
  assert.deepEqual(written, [
    ['Perfect', 10, 10, '100.00%'],
    ['Popular', 90, 100, '90.00%'],
    ['Alpha', 9, 10, '90.00%'],
    ['Beta', 9, 10, '90.00%'],
    ['Unvoted', 0, 0, '0.00%'],
  ])
})
