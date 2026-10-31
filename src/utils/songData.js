// Sibling names share a display ID, while playback and voting keys stay separate.
// Groups are numbered by their first appearance in soundtrack order.
export function buildSongIds(entries, songOrder = []) {
  const parents = new Map(entries.map(entry => [entry.name, entry.name]))
  const ranks = new Map(songOrder.map((name, index) => [name, index]))

  function root(name) {
    let current = name
    while (parents.get(current) !== current) current = parents.get(current)
    return current
  }

  for (const entry of entries) {
    const sibling = typeof entry.sibling === 'string' ? entry.sibling.trim() : ''
    if (parents.has(sibling)) {
      parents.set(root(entry.name), root(sibling))
    }
  }

  const ordered = [...entries].sort((a, b) =>
    (ranks.get(a.name) ?? Infinity) - (ranks.get(b.name) ?? Infinity))
  const groupIds = new Map()
  const ids = new Map()
  for (const entry of ordered) {
    const group = root(entry.name)
    if (!groupIds.has(group)) groupIds.set(group, groupIds.size + 1)
    ids.set(entry.name, groupIds.get(group))
  }
  return ids
}
