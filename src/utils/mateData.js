export const mateModes = ["base", "sacred", "ace", "goner", "ncanon", "costumes", "npc"];

export function createMateBuckets() {
  return Object.fromEntries(mateModes.map(mode => [mode, []]));
}

const inheritedModes = new Set(["ace", "sacred"]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function applyInheritedFields(form, baseForm, mode) {
  const expanded = { ...(baseForm || {}), ...form };

  if (mode === "costumes") {
    const dexEntries = form.dexEntries || {};
    return {
      ...form,
      store: form.store || dexEntries["Store Entry"] || dexEntries.Store,
      catalog: form.catalog || dexEntries.Catalog,
      reverense: form.reverense || dexEntries.Reverense
    };
  }

  if (mode === "ncanon") {
    return { ...form, rarity: form.rarity || "Normal" };
  }

  if (inheritedModes.has(mode)) {
    return expanded;
  }

  return { ...form };
}

function getOutputMode(mode, sourceKind) {
  if ((sourceKind === "lost" || sourceKind === "goner") && mode === "base") return "goner";
  return mode;
}

function isEventForm(form) {
  return form?.event !== undefined && form?.event !== null;
}

export function expandGroupedMateData(groups, sourceKind = "base", options = {}) {
  const buckets = createMateBuckets();
  const eventOnly = options.eventOnly === true;

  if (!Array.isArray(groups)) return buckets;

  groups.forEach(group => {
    if (!group || typeof group !== "object") return;

    if (!group.forms || typeof group.forms !== "object") {
      return;
    }

    const groupName = String(group.name || "").trim();
    const baseForm = Array.isArray(group.forms.base) && group.forms.base.length
      ? clone(group.forms.base[0])
      : null;

    Object.entries(group.forms).forEach(([mode, forms]) => {
      const outputMode = getOutputMode(mode, sourceKind);
      if (!buckets[outputMode] || !Array.isArray(forms)) return;
      forms.forEach(form => {
        if (!form || typeof form !== "object") return;
        if (eventOnly && !isEventForm(form)) return;
        buckets[outputMode].push({
          ...applyInheritedFields(form, baseForm, mode),
          ref: form.ref || groupName,
          mode: outputMode,
          __groupName: groupName
        });
      });
    });
  });

  return buckets;
}

export function mergeMateBuckets(...bucketSets) {
  const merged = createMateBuckets();

  bucketSets.forEach(buckets => {
    mateModes.forEach(mode => {
      if (Array.isArray(buckets?.[mode])) {
        merged[mode].push(...buckets[mode]);
      }
    });
  });

  return merged;
}

function mateBucketKey(mate) {
  return [
    mate?.mode || "",
    mate?.ref || "",
    mate?.name || "",
    mate?.image || "",
    mate?.event || ""
  ].join("\u0000");
}

function removeExistingBucketEntries(source, existing) {
  const seen = new Set();
  mateModes.forEach(mode => {
    (existing?.[mode] || []).forEach(mate => {
      seen.add(mateBucketKey(mate));
    });
  });

  const filtered = createMateBuckets();
  mateModes.forEach(mode => {
    filtered[mode] = (source?.[mode] || []).filter(mate => !seen.has(mateBucketKey(mate)));
  });
  return filtered;
}

export async function fetchMateBuckets() {
  const [baseGroups, lostGroups, gonerGroups, npc] = await Promise.all([
    fetch("data/mates/base.json").then(response => response.json()).catch(() => []),
    fetch("data/mates/lost.json").then(response => response.json()).catch(() => []),
    fetch("data/mates/goner.json").then(response => response.json()).catch(() => []),
    fetch("data/mates/npc.json").then(response => response.json()).catch(() => [])
  ]);

  const baseBuckets = expandGroupedMateData(baseGroups, "base");
  const lostBuckets = expandGroupedMateData(lostGroups, "lost");
  const loadedBuckets = mergeMateBuckets(baseBuckets, lostBuckets);
  const gonerEventBuckets = removeExistingBucketEntries(
    expandGroupedMateData(gonerGroups, "goner", { eventOnly: true }),
    loadedBuckets
  );
  const buckets = mergeMateBuckets(loadedBuckets, gonerEventBuckets);
  buckets.npc = Array.isArray(npc) ? npc : [];
  return buckets;
}
