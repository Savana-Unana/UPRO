export const characters = ['Skip', 'Chip', 'Dip', 'Pip', 'Zip', 'Herc', 'Marvin', 'Mom', 'Dad', 'Lumberjack', 'Hippie', 'Mysterious Trader', 'Kal']
export const times = ['Pre-Update 1', ...Array.from({ length: 10 }, (_, i) => `Post-Update ${i + 1}`), 'Post-Update 10.5']
export const selectableTimes = times.slice(0, 2)

export function listResponses(data) {
  return Object.entries(data.characters || {}).flatMap(([character, periods]) =>
    Object.entries(periods).flatMap(([time, questions]) =>
      questions.map(ask => ({ ...ask, character, time, answered: Array.isArray(ask.response) && ask.response.length > 0 }))
    )
  ).sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

export function mergeLiveAsks(data, liveAsks) {
  const committed = listResponses(data)
  const byId = new Map(committed.map(ask => [ask.id, ask]))
  for (const ask of liveAsks) {
    const saved = byId.get(ask.id)
    byId.set(ask.id, {
      ...ask,
      response: saved?.response || [],
      answered: Boolean(saved?.answered),
    })
  }
  return [...byId.values()].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}
