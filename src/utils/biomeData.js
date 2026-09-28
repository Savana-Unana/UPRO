// A sub-biome belongs to one explicit parent, even when names repeat.
export function subBiomeOptions(byBiome, parents = Object.keys(byBiome || {})) {
  return parents.flatMap(parent =>
    (Array.isArray(byBiome?.[parent]) ? byBiome[parent] : [])
      .filter(Boolean)
      .map(subBiome => ({ name: subBiome, value: `${parent}: ${subBiome}` }))
  )
}

export function mateSubBiomes(mate, parent) {
  const byBiome = mate?.subBiomes
  if (!byBiome || Array.isArray(byBiome) || typeof byBiome !== 'object') return []
  if (parent !== undefined) return Array.isArray(byBiome[parent]) ? byBiome[parent].filter(Boolean) : []
  return Object.values(byBiome).flatMap(values => Array.isArray(values) ? values.filter(Boolean) : [])
}
