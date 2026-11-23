import fs from 'node:fs'

const [sourcePath, entriesPath = 'data/mates/entries.json', reportPath = 'output/reports/entries-import.json'] = process.argv.slice(2)
if (!sourcePath) throw new Error('Usage: node scripts/import-entry-mass-file.mjs <source.txt> [entries.json] [report.json]')

const fixMojibake = value => String(value || '')
  .replaceAll('â€™', '’')
  .replaceAll('â€œ', '“')
  .replaceAll('â€', '”')
  .replaceAll('â€¦', '…')
  .replaceAll('â€“', '–')
  .replaceAll('â€”', '—')
  .replaceAll('â€˜', '‘')
  .replaceAll('Â', '')
  .trim()

const fieldMap = new Map([
  ['Gender Split', 'genderSplit'],
  ['Average Height', 'averageHeight'],
  ['Average Length', 'averageLength'],
  ['Average Width', 'averageWidth'],
  ['Average Weight', 'averageWeight'],
  ['Primary Color', 'primaryColor'],
  ['Unique Height', 'uniqueHeight'],
  ['Unique Length', 'uniqueLength'],
  ['Unique Width', 'uniqueWidth'],
  ['Unique Weight', 'uniqueWeight'],
  ['Unique Feature', 'uniqueFeature'],
  ['Sacred Issue', 'sacredIssue'],
  ['Sacred Solution', 'sacredSolution'],
])
const entryLabels = new Set(['Discovered', 'First Caught', 'Experienced', 'Callside', 'Store Entry', 'Catalog', 'Utilized'])
const metadataMap = new Map([
  ['Written By', 'entryWriter'],
  ['Date Origin', 'entryDateOrigin'],
  ['Entry Date', 'entryDate'],
])
const knownLabels = new Set([...fieldMap.keys(), ...entryLabels, ...metadataMap.keys()])

const records = []
let current = null
let currentEntry = ''
for (const rawLine of fs.readFileSync(sourcePath, 'utf8').split(/\r?\n/)) {
  const line = fixMojibake(rawLine)
  if (!line) continue
  const match = line.match(/^([^:]+):\s*(.*)$/)
  if (!match) {
    if (current && currentEntry) {
      current.entries[currentEntry].text = `${current.entries[currentEntry].text} ${line}`.trim()
    }
    continue
  }

  const label = match[1].trim()
  const value = match[2].trim()
  if (!knownLabels.has(label)) {
    current = { name: label, fields: {}, entries: {}, sourceFields: [] }
    records.push(current)
    currentEntry = ''
    continue
  }
  if (!current) continue

  current.sourceFields.push(label)
  if (fieldMap.has(label)) {
    current.fields[fieldMap.get(label)] = value || (label.startsWith('Sacred ') ? 'No entry yet' : 'Ungathered')
    currentEntry = ''
  } else if (entryLabels.has(label)) {
    currentEntry = label
    current.entries[label] = {
      text: value || 'No entry yet',
      entryWriter: 'Ungathered',
      entryDateOrigin: 'Ungathered',
      entryDate: 'Ungathered',
    }
  } else if (metadataMap.has(label) && currentEntry) {
    current.entries[currentEntry][metadataMap.get(label)] = value || 'Ungathered'
  }
}

const data = JSON.parse(fs.readFileSync(entriesPath, 'utf8'))
const candidates = []
for (const group of data.mates || []) {
  for (const [mode, forms] of Object.entries(group.forms || {})) {
    for (const form of forms) candidates.push({ group: group.category, mode, form })
  }
}

const normalize = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')
const updates = []
const unmatched = []
const ambiguous = []

for (const record of records) {
  const exact = candidates.filter(candidate => normalize(candidate.form.name) === normalize(record.name))
  let matches = exact
  if (matches.length > 1) {
    const preferredMode = /^sacred\s/i.test(record.name) ? 'sacred' : 'base'
    const preferred = matches.filter(candidate => candidate.mode === preferredMode)
    if (preferred.length === 1) matches = preferred
  }
  if (!matches.length) {
    unmatched.push(record.name)
    continue
  }
  if (matches.length > 1) {
    ambiguous.push({ name: record.name, matches: matches.map(match => `${match.group}/${match.mode}/${match.form.name}`) })
    continue
  }

  const target = matches[0]
  Object.assign(target.form, record.fields)
  target.form.entries ||= {}
  for (const [entryName, entry] of Object.entries(record.entries)) {
    target.form.entries[entryName] = entry
  }
  updates.push({
    source: record.name,
    target: `${target.group}/${target.mode}/${target.form.name}`,
    fields: record.sourceFields,
  })
}

fs.mkdirSync(new URL('../output/reports/', import.meta.url), { recursive: true })
fs.writeFileSync(entriesPath, `${JSON.stringify(data, null, 2)}\n`)
const report = { source: sourcePath, records: records.length, updated: updates.length, unmatched, ambiguous, updates }
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({ records: records.length, updated: updates.length, unmatched, ambiguous }, null, 2))
