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

export function buildEvolutionStageIndex(mates) {
  const outgoing = new Map();
  const incoming = new Map();
  const names = new Set();

  (Array.isArray(mates) ? mates : []).forEach(mate => {
    const name = String(mate?.name || "").trim();
    if (!name) return;
    names.add(name);
    if (!outgoing.has(name)) outgoing.set(name, new Set());
    if (!incoming.has(name)) incoming.set(name, new Set());

    (mate.evolvesTo || []).forEach(evolution => {
      const target = String(evolution?.name || "").trim();
      if (!target) return;
      names.add(target);
      if (!outgoing.has(target)) outgoing.set(target, new Set());
      if (!incoming.has(target)) incoming.set(target, new Set());
      outgoing.get(name).add(target);
      incoming.get(target).add(name);
    });
  });

  const stagesByName = new Map(Array.from(names, name => [name, new Set()]));
  const positionsByName = new Map(Array.from(names, name => [name, new Set()]));
  const roots = Array.from(names).filter(name => !incoming.get(name)?.size);

  function visit(name, stage, path) {
    stagesByName.get(name)?.add(stage);
    if (path.has(name)) return;
    const nextPath = new Set(path);
    nextPath.add(name);
    (outgoing.get(name) || []).forEach(target => visit(target, stage + 1, nextPath));
  }

  roots.forEach(root => visit(root, 1, new Set()));
  names.forEach(name => {
    if (!stagesByName.get(name)?.size) visit(name, 1, new Set());
  });

  function recordLine(path) {
    path.forEach((name, index) => positionsByName.get(name)?.add(`${index + 1}/${path.length}`));
  }

  function visitLine(name, path) {
    if (path.includes(name)) {
      recordLine(path);
      return;
    }
    const nextPath = [...path, name];
    const children = Array.from(outgoing.get(name) || []);
    if (!children.length) {
      recordLine(nextPath);
      return;
    }
    children.forEach(child => visitLine(child, nextPath));
  }

  roots.forEach(root => visitLine(root, []));
  names.forEach(name => {
    if (!positionsByName.get(name)?.size) visitLine(name, []);
  });

  return new Map(Array.from(names, name => {
    const hasParents = Boolean(incoming.get(name)?.size);
    const hasChildren = Boolean(outgoing.get(name)?.size);
    return [name, {
      stages: stagesByName.get(name),
      positions: positionsByName.get(name),
      first: !hasParents,
      middle: hasParents && hasChildren,
      final: !hasChildren
    }];
  }));
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
  const gonerBuckets = removeExistingBucketEntries(
    expandGroupedMateData(gonerGroups, "goner"),
    loadedBuckets
  );
  const buckets = mergeMateBuckets(loadedBuckets, gonerBuckets);
  buckets.evolution = mergeMateBuckets(
    expandGroupedMateData(baseGroups, "base"),
    expandGroupedMateData(lostGroups, "base"),
    expandGroupedMateData(gonerGroups, "base")
  );
  buckets.npc = Array.isArray(npc) ? npc : [];
  return buckets;
}
