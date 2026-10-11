export function sortCostumesByUpdate(costumes) {
  const rank = costume => {
    const match = String(costume.firstObtainableUpdate ?? '').match(/\d+(?:\.\d+)?/)
    return match ? Number(match[0]) : -1
  }
  return [...costumes].sort((a, b) => rank(a) - rank(b))
}
