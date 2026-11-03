export function buildTypingStats(mates, isCompleted) {
  const counts = {};
  const emptyCounts = () => ({ all: 0, primary: 0, para: 0, solo: 0, allDen: 0, primaryDen: 0, paraDen: 0, soloDen: 0 });

  mates.forEach(mate => {
    const types = [...new Set((mate.types || []).filter(Boolean))];
    const paras = [...new Set((mate.paraTypes || []).filter(Boolean))];
    const completed = isCompleted(mate);
    const count = (type, field) => {
      const entry = counts[type] ||= emptyCounts();
      entry[`${field}Den`] += 1;
      if (completed) entry[field] += 1;
    };

    types.forEach((type, index) => {
      count(type, 'all');
      if (index === 0) count(type, 'primary');
      if (types.length === 1) count(type, 'solo');
    });
    paras.forEach(type => count(type, 'para'));
  });

  return Object.entries(counts).sort(([a, left], [b, right]) =>
    right.allDen - left.allDen || a.localeCompare(b)
  );
}
