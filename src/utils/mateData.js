export const mateModes = ["base", "sacred", "ace", "goner", "ncanon", "costumes", "npc"];

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
    All: "Metaforest-Rainforest.png",
    Rainforest: "Metaforest-Rainforest.png",
    "Cherry Grove": "Metaforest-CherryGrove.png",
    "Mushroom Fields": "Metaforest-MushroomFields.png",
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

export async function fetchMateBuckets() {
  const [baseGroups, lostGroups, npc] = await Promise.all([
    fetch("data/mates/base.json").then(response => response.json()).catch(() => []),
    fetch("data/mates/lost.json").then(response => response.json()).catch(() => []),
    fetch("data/mates/npc.json").then(response => response.json()).catch(() => [])
  ]);

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
