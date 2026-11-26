export const mateModes = ["base", "sacred", "ace", "goner", "ncanon", "costumes", "npc"];

export function getMateStatus(mate) {
  const folder = String(mate?.image || "").replace(/\\/g, "/")
    .match(/(?:^|\/)assets\/images\/mates\/([^/]+)\//i)?.[1]?.toLowerCase();
  if (folder === "base" || folder === "other") return "finalized";
  if (folder === "lost") return "conceptualized";
  if (folder === "goner") return "nonfinalized";
  return null;
}

const subBiomeImages = {
  Forest: {
    Day: "Forest-Day.png",
    Night: "Forest-Night.png",
    Lake: "Forest-Lake.png",
    Spooky: "Forest-Spooky.png"
  },
  Badlands: {
    Day: "Badlands-Day.png",
    Night: "Badlands-Night.png"
  },
  Metaforest: {
    Rainforest: "Metaforest-Rainforest.png",
    "Cherry Grove": "Metaforest-CherryGrove.png",
    "Mushroom Marsh": "Metaforest-MushroomFields.png",
    "Garden Grounds": "Metaforest-GardenGrounds.png"
  },
  "Perfecatoly Plains": {
    Plains: "PerfecatolyPlains-Plains.png",
    Farms: "PerfecatolyPlains-Farms.png"
  }
};

const defaultSubBiomes = {
  Forest: "Day",
  Badlands: "Day",
  Metaforest: "Rainforest",
  "Perfecatoly Plains": "Plains"
};

const biomeImages = {
  Lake: "Lake.png",
  "Deeper Waters": "DeeperWaters.png",
  River: "River.png",
  Oasis: "Oasis.png",
  Canyon: "Canyon.png",
  "Meridian Bay": "MeridianBay.png",
  Alcatraz: "Alcatraz.png",
  "Borgo Slor": "BorgoSlor.png",
  Ocean: "Ocean.png",
  "Ranch Isles": "RanchIsles.png",
  "Axo-Skerry": "AxoSkerry.png",
  "Têtignée Island": "TetigneeIsland.png",
  Caverns: "Caverns.png",
  Mountains: "Mountains.png",
  "Empire City": "EmpireCity.png",
  "New Canadia": "NewCanadia.png",
  Swamp: "Swamp.png",
  "Lab Fungen": "LabFungen.png",
  "Shiver Plains": "ShiverPlains.png",
  "Shiver Co": "ShiverCo.png",
  Ieland: "Ieland.png",
  "Operation UPRO": "UPRO.png"
};

export function getBiomeImagePath(biomeName, subBiomeName = "") {
  const biome = String(biomeName || "").trim();
  const subBiome = String(subBiomeName || "").trim();
  const subBiomeMap = subBiomeImages[biome];
  const fileName = subBiomeMap
    ? subBiomeMap[subBiome] || subBiomeMap[defaultSubBiomes[biome]]
    : biomeImages[biome];

  return fileName
    ? `${import.meta.env.BASE_URL}assets/images/ui/biomes/${fileName}`
    : "";
}

export function createMateBuckets() {
  return Object.fromEntries(mateModes.map(mode => [mode, []]));
}

const inheritedModes = new Set(["ace", "sacred"]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const entryNumberPlaceholder = "Ungathered";
const entryTextPlaceholder = "No entry yet";

function applyEntryProfile(form, profile = {}) {
  const entries = profile.entries && typeof profile.entries === "object" ? profile.entries : {};
  const dexEntries = Object.fromEntries(Object.entries(entries).map(([key, entry]) => [
    key,
    typeof entry === "string" ? entry : entry?.text || entryTextPlaceholder
  ]));
  return {
    ...form,
    genderSplit: profile.genderSplit || entryNumberPlaceholder,
    averageHeight: profile.averageHeight || entryNumberPlaceholder,
    averageLength: profile.averageLength || entryNumberPlaceholder,
    averageWidth: profile.averageWidth || entryNumberPlaceholder,
    averageWeight: profile.averageWeight || entryNumberPlaceholder,
    primaryColor: profile.primaryColor || entryNumberPlaceholder,
    uniqueHeight: profile.uniqueHeight || "",
    uniqueLength: profile.uniqueLength || "",
    uniqueWidth: profile.uniqueWidth || "",
    uniqueWeight: profile.uniqueWeight || "",
    uniqueFeature: profile.uniqueFeature || "",
    entryDetails: entries,
    sacredIssue: profile.sacredIssue || entryTextPlaceholder,
    sacredSolution: profile.sacredSolution || entryTextPlaceholder,
    dexEntries,
    height: profile.averageHeight || entryNumberPlaceholder,
    color: profile.primaryColor || entryNumberPlaceholder,
    description: profile.description || entryTextPlaceholder,
    visualDescription: profile.visualDescription || entryTextPlaceholder,
    visualAppearance: profile.visualAppearance || entryTextPlaceholder
  };
}

function mergeMateEntries(groups, entriesData) {
  const entryGroups = Array.isArray(entriesData?.mates) ? entriesData.mates : [];
  const byCategory = new Map(entryGroups.map(group => [String(group?.category || group?.name || "").trim(), group]));

  return (Array.isArray(groups) ? groups : []).map(group => {
    const category = String(group?.category || group?.name || "").trim();
    const entryGroup = byCategory.get(category);
    return {
      ...group,
      category,
      forms: Object.fromEntries(Object.entries(group.forms || {}).map(([mode, forms]) => {
        const profiles = Array.isArray(entryGroup?.forms?.[mode]) ? entryGroup.forms[mode] : [];
        const nameOffsets = new Map();
        const mergedForms = (Array.isArray(forms) ? forms : []).map((form, index) => {
          const name = String(form?.name || "");
          const offset = nameOffsets.get(name) || 0;
          nameOffsets.set(name, offset + 1);
          const matchingProfiles = profiles.filter(profile => String(profile?.name || "") === name);
          const profile = profiles[index]?.name === name ? profiles[index] : matchingProfiles[offset];
          return applyEntryProfile(form, profile);
        });
        return [mode, mergedForms];
      }))
    };
  });
}

function mergeNpcEntries(npcs, entriesData) {
  const profiles = Array.isArray(entriesData?.npc) ? entriesData.npc : [];
  const offsets = new Map();
  return (Array.isArray(npcs) ? npcs : []).map((npc, index) => {
    const key = `${npc?.id || ""}\u0000${npc?.name || ""}`;
    const offset = offsets.get(key) || 0;
    offsets.set(key, offset + 1);
    const matches = profiles.filter(profile => `${profile?.id || ""}\u0000${profile?.name || ""}` === key);
    const profile = profiles[index]?.id === npc?.id && profiles[index]?.name === npc?.name
      ? profiles[index]
      : matches[offset];
    return applyEntryProfile(npc, profile);
  });
}

function applyInheritedFields(form, baseForm, mode) {
  const expanded = { ...(baseForm || {}), ...form };

  if (mode === "costumes") {
    const dexEntries = form.dexEntries || {};
    return {
      ...form,
      store: form.store || dexEntries["Store Entry"] || dexEntries.Store,
      catalog: form.catalog || dexEntries.Catalog,
      callside: form.callside || dexEntries.Callside || dexEntries.Reverense
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
  if (sourceKind === "lost" && mode === "base") return "goner";
  return mode;
}

export function inferMateEvent(form) {
  // An explicit null keeps normally obtainable animates in the regular roster,
  // even when their wild availability falls during an event update.
  if (form.event !== undefined) return form;
  const updates = [form.firstScannableUpdate, form.firstWildCatchableUpdate,
    form.versions, form.version, form.Version].flat();
  const halloween = updates.some(value => /^(?:Update|Demo)\s+10\.5$/i.test(String(value || "").trim()));
  return halloween ? { ...form, event: "halloween" } : form;
}

function isEventForm(form) {
  return form?.event !== undefined && form?.event !== null;
}

export function expandGroupedMateData(groups, sourceKind = "base", options = {}) {
  const buckets = createMateBuckets();
  const eventOnly = options.eventOnly === true;

  if (!Array.isArray(groups)) return buckets;

  // Forms belonging to members of one evolution line should share an
  // alternate-form reference. Without this, e.g. Unoa and Unob each get a
  // separate ref and the Sacred tab cannot find the line's other formes.
  const lineParent = new Map();
  groups.forEach(group => {
    const name = String(group?.name || "").trim();
    if (!name) return;
    lineParent.set(name, name);
  });
  const findLineRoot = name => {
    let current = name;
    const seen = new Set();
    while (current && !seen.has(current)) {
      seen.add(current);
      const parent = groups.find(group =>
        Array.isArray(group?.forms?.base) && group.forms.base.some(form =>
          Array.isArray(form?.evolvesTo) && form.evolvesTo.some(next => String(next?.name || "").trim() === current)
        )
      );
      if (!parent) break;
      current = String(parent.name || "").trim();
    }
    return current || name;
  };

  groups.forEach(group => {
    if (!group || typeof group !== "object") return;

    if (!group.forms || typeof group.forms !== "object") {
      return;
    }

    const groupName = String(group.category || group.name || "").trim();
    const inheritedForm = Array.isArray(group.forms.base) && group.forms.base.length
      ? group.forms.base[0]
      : Array.isArray(group.forms.goner) && group.forms.goner.length
        ? group.forms.goner[0]
        : null;
    const baseForm = inheritedForm ? clone(inheritedForm) : null;

    Object.entries(group.forms).forEach(([mode, forms]) => {
      const outputMode = getOutputMode(mode, sourceKind);
      if (!buckets[outputMode] || !Array.isArray(forms)) return;
      forms.forEach(form => {
        if (!form || typeof form !== "object") return;
        const expanded = inferMateEvent(applyInheritedFields(form, baseForm, mode));
        if (eventOnly && !isEventForm(expanded)) return;
        buckets[outputMode].push({
          ...expanded,
          ref: form.ref || findLineRoot(groupName),
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
      first: !hasParents && hasChildren,
      middle: hasParents && hasChildren,
      final: !hasChildren
    }];
  }));
}

export async function fetchMateBuckets(options = {}) {
  const includeNpc = options.includeNpc !== false;
  const [rawBaseGroups, rawLostGroups, rawNpc, entriesData] = await Promise.all([
    fetch("data/mates/base.json").then(response => response.json()).catch(() => []),
    fetch("data/mates/lost.json").then(response => response.json()).catch(() => []),
    includeNpc
      ? fetch("data/mates/npc.json").then(response => response.json()).catch(() => [])
      : Promise.resolve([]),
    fetch("data/mates/entries.json").then(response => response.json()).catch(() => ({}))
  ]);

  const baseGroups = mergeMateEntries(rawBaseGroups, entriesData);
  const lostGroups = mergeMateEntries(rawLostGroups, entriesData);
  const npc = mergeNpcEntries(rawNpc, entriesData);

  const baseBuckets = expandGroupedMateData(baseGroups, "base");
  const lostBuckets = expandGroupedMateData(lostGroups, "lost");
  const buckets = mergeMateBuckets(baseBuckets, lostBuckets);
  buckets.evolution = mergeMateBuckets(
    expandGroupedMateData(baseGroups, "base"),
    expandGroupedMateData(lostGroups, "base")
  );
  buckets.npc = Array.isArray(npc) ? npc : [];
  return buckets;
}
