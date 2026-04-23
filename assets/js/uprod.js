let allData = {};
let typesData = [];
let abilitiesData = [];
let creditsData = [];
let crorderData = [];
let visibleMates = [];
let currentMateIndex = 0;
let crossTabFormsByRef = new Map();
let mateByName = new Map();
let creditsByAnimate = new Map();
let crorderRank = new Map();

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("uprodGrid");
  const conceptedFilter = document.getElementById("conceptedFilter");
  const assistedFilter = document.getElementById("assistedFilter");
  const namedFilter = document.getElementById("namedFilter");
  const modal = document.getElementById("detailsModal");
  const closeModal = document.getElementById("closeModal");
  const nextMate = document.getElementById("nextMate");
  const prevMate = document.getElementById("prevMate");
  const modeBadge = document.getElementById("modeBadge");

  const allowedRarities = new Set(["Normal", "Mode", "Shiver", "Paragon"]);

  function annotateMateOrder(mode, mates) {
    (mates || []).forEach((mate, index) => {
      mate.__mode = mode;
      mate.__order = index;
    });
    return mates || [];
  }

  function normalizeCreditsEntry(entry) {
    if (!entry || typeof entry !== "object") {
      return { person: "Unknown", concepted: [], assisted: [], named: [] };
    }
    return {
      person: String(entry.person || "Unknown").trim() || "Unknown",
      concepted: Array.isArray(entry.concepted) ? entry.concepted.map(x => String(x || "").trim()).filter(Boolean) : [],
      assisted: normalizeAssistedItems(entry.assisted),
      named: Array.isArray(entry.named) ? entry.named.map(x => String(x || "").trim()).filter(Boolean) : []
    };
  }

  function normalizeAssistedItems(items) {
    if (!Array.isArray(items)) return [];
    return items
      .map(item => {
        if (typeof item === "string") {
          const name = item.trim();
          return name ? { name, how: "" } : null;
        }
        if (!item || typeof item !== "object") return null;
        const name = String(item.name || "").trim();
        const how = String(item.how || "").trim();
        if (!name) return null;
        return { name, how };
      })
      .filter(Boolean);
  }

  function getRarities(mate) {
    const raw = mate?.rarity;
    let list = [];

    if (Array.isArray(raw)) list = raw;
    else if (typeof raw === "string") list = raw.split(/[,+|/]/g).map(x => x.trim()).filter(Boolean);
    else if (raw !== undefined && raw !== null) list = [String(raw).trim()];

    const normalized = [];
    list.forEach(rarity => {
      if (allowedRarities.has(rarity) && !normalized.includes(rarity)) normalized.push(rarity);
    });

    if (!normalized.length) return ["Normal"];
    if (normalized.length > 1) return normalized.filter(rarity => rarity !== "Normal");
    return normalized;
  }

  const hasRarity = (mate, rarity) => getRarities(mate).includes(rarity);
  const isMode = mate => hasRarity(mate, "Mode");
  const isShiver = mate => hasRarity(mate, "Shiver");
  const isParagon = mate => hasRarity(mate, "Paragon");

  function getMateRef(mate) {
    const explicitRef = String(mate?.ref || "").trim();
    if (explicitRef) return explicitRef;
    return String(mate?.name || "").trim();
  }

  function getReferenceKey(mate) {
    return String(mate?.name || "").trim();
  }

  function getNpcFamilyKey(mate) {
    return String(mate?.id || "").trim();
  }

  function getAlternateGroupKey(mate) {
    if ((mate?.mode || "") === "npc") return `npc:${getNpcFamilyKey(mate)}`;
    return `ref:${getResolvedMateRef(mate)}`;
  }

  function getModeRank(mode) {
    const rank = { base: 0, sacred: 1, ace: 2, goner: 3, ncanon: 4, event: 5, costumes: 6, npc: 7 };
    return rank[mode] ?? 999;
  }

  function chooseReferencedMate(candidates, requesterMode = "") {
    if (!Array.isArray(candidates) || !candidates.length) return null;
    const preferred = candidates.slice().sort((a, b) => {
      const aRequesterPenalty = (a.mode || "") === requesterMode ? -1 : 0;
      const bRequesterPenalty = (b.mode || "") === requesterMode ? -1 : 0;
      if (aRequesterPenalty !== bRequesterPenalty) return aRequesterPenalty - bRequesterPenalty;
      return getModeRank(a.mode) - getModeRank(b.mode);
    });
    return preferred[0] || null;
  }

  function resolveReferenceRoot(mate, visited = new Set()) {
    if (!mate) return null;

    const ownName = getReferenceKey(mate);
    const explicitRef = String(mate?.ref || "").trim();
    if (!explicitRef || explicitRef === ownName) return mate;

    const visitKey = `${mate.mode || ""}|${ownName}|${explicitRef}`;
    if (visited.has(visitKey)) return mate;
    visited.add(visitKey);

    const candidates = (mateByName.get(explicitRef) || []).filter(candidate => {
      return !(
        (candidate.mode || "") === (mate.mode || "") &&
        String(candidate.name || "").trim() === ownName &&
        String(candidate.image || "") === String(mate.image || "")
      );
    });
    const referencedMate = chooseReferencedMate(candidates, mate.mode || "");
    if (!referencedMate) return mate;
    return resolveReferenceRoot(referencedMate, visited);
  }

  function getResolvedMateRef(mate) {
    const resolvedMate = resolveReferenceRoot(mate);
    return getReferenceKey(resolvedMate || mate);
  }

  function rebuildRefIndexes() {
    crossTabFormsByRef = new Map();
    mateByName = new Map();

    Object.entries(allData).forEach(([mode, mates]) => {
      (mates || []).forEach(mate => {
        const form = { ...mate, mode };
        const ownName = getReferenceKey(form);
        if (!ownName) return;
        if (!mateByName.has(ownName)) mateByName.set(ownName, []);
        mateByName.get(ownName).push(form);
      });
    });

    mateByName.forEach(forms => {
      forms.sort((a, b) => getModeRank(a.mode) - getModeRank(b.mode));
    });

    Object.entries(allData).forEach(([mode, mates]) => {
      (mates || []).forEach(mate => {
        const form = { ...mate, mode };
        const resolvedRef = getResolvedMateRef(form);
        if (!resolvedRef) return;
        if (!crossTabFormsByRef.has(resolvedRef)) crossTabFormsByRef.set(resolvedRef, []);
        crossTabFormsByRef.get(resolvedRef).push(form);
      });
    });
  }

  function buildCreditsIndex() {
    creditsByAnimate = new Map();
    creditsData.forEach(entry => {
      entry.concepted.forEach(name => {
        const key = String(name || "").trim();
        if (!key) return;
        if (!creditsByAnimate.has(key)) creditsByAnimate.set(key, { concepted: [], assisted: [], named: [] });
        const record = creditsByAnimate.get(key);
        if (!record.concepted.includes(entry.person)) record.concepted.push(entry.person);
      });
      entry.assisted.forEach(item => {
        const key = String(item?.name || "").trim();
        if (!key) return;
        if (!creditsByAnimate.has(key)) creditsByAnimate.set(key, { concepted: [], assisted: [], named: [] });
        const record = creditsByAnimate.get(key);
        if (!record.assisted.some(assisted => assisted.person === entry.person && assisted.how === item.how)) {
          record.assisted.push({ person: entry.person, how: item.how || "" });
        }
      });
      entry.named.forEach(name => {
        const key = String(name || "").trim();
        if (!key) return;
        if (!creditsByAnimate.has(key)) creditsByAnimate.set(key, { concepted: [], assisted: [], named: [] });
        const record = creditsByAnimate.get(key);
        if (!record.named.includes(entry.person)) record.named.push(entry.person);
      });
    });
  }

  function rebuildCrorderRanks() {
    crorderRank = new Map();
    crorderData.forEach((name, index) => {
      const trimmed = String(name || "").trim();
      if (!trimmed || crorderRank.has(trimmed)) return;
      crorderRank.set(trimmed, index);
    });
  }

  function populateFilters() {
    const people = Array.from(new Set(creditsData.map(entry => entry.person))).sort((a, b) => a.localeCompare(b));
    people.forEach(person => {
      const conceptOption = document.createElement("option");
      conceptOption.value = person;
      conceptOption.textContent = person;
      conceptedFilter.appendChild(conceptOption);

      const assistedOption = document.createElement("option");
      assistedOption.value = person;
      assistedOption.textContent = person;
      assistedFilter.appendChild(assistedOption);

      const namedOption = document.createElement("option");
      namedOption.value = person;
      namedOption.textContent = person;
      namedFilter.appendChild(namedOption);
    });
  }

  function getMateCredits(mate) {
    const namesToCheck = [String(mate?.name || "").trim(), getResolvedMateRef(mate)].filter(Boolean);
    const combined = { concepted: [], assisted: [], named: [] };

    namesToCheck.forEach(name => {
      const record = creditsByAnimate.get(name);
      if (!record) return;
      record.concepted.forEach(person => {
        if (!combined.concepted.includes(person)) combined.concepted.push(person);
      });
      record.assisted.forEach(item => {
        if (!combined.assisted.some(assisted => assisted.person === item.person && assisted.how === item.how)) {
          combined.assisted.push(item);
        }
      });
      record.named.forEach(person => {
        if (!combined.named.includes(person)) combined.named.push(person);
      });
    });

    return combined;
  }

  function buildDisplayPool() {
    const seen = new Set();
    const pool = [];

    ["base", "sacred", "ace", "ncanon", "goner", "event", "costumes", "npc"].forEach(mode => {
      const mates = allData[mode] || [];
      mates.forEach(mate => {
        const form = { ...mate, mode };
        if (isMode(form)) return;
        if (!crorderRank.has(String(form.name || ""))) return;
        const key = `${form.mode || ""}|${form.__order ?? ""}|${form.name || ""}|${form.image || ""}`;
        if (seen.has(key)) return;
        seen.add(key);
        pool.push(form);
      });
    });

    return pool.sort((a, b) => {
      const aName = String(a.name || "");
      const bName = String(b.name || "");
      const aRank = crorderRank.has(aName) ? crorderRank.get(aName) : Number.POSITIVE_INFINITY;
      const bRank = crorderRank.has(bName) ? crorderRank.get(bName) : Number.POSITIVE_INFINITY;

      if (aRank !== bRank) return aRank - bRank;

      const nameCompare = aName.localeCompare(bName);
      if (nameCompare !== 0) return nameCompare;

      return getModeRank(a.mode) - getModeRank(b.mode);
    });
  }

  function renderGrid() {
    const selectedConcepted = conceptedFilter.value;
    const selectedAssisted = assistedFilter.value;
    const selectedNamed = namedFilter.value;
    const mates = buildDisplayPool().filter(mate => {
      const credits = getMateCredits(mate);
      if (selectedConcepted && !credits.concepted.includes(selectedConcepted)) return false;
      if (selectedAssisted && !credits.assisted.includes(selectedAssisted)) return false;
      if (selectedNamed && !credits.named.includes(selectedNamed)) return false;
      return true;
    });
    visibleMates = mates;
    grid.innerHTML = "";

    if (!mates.length) {
      grid.innerHTML = `<div class="cat-empty">No matching animates.</div>`;
      return;
    }

    mates.forEach(mate => {
      grid.appendChild(makeCard(mate));
    });
  }

  function makeCard(mate) {
    const card = document.createElement("div");
    card.className = "card";
    if (isParagon(mate)) card.classList.add("rarity-paragon");
    applyMateStyle(card, mate);

    const lostImage = mate.image && mate.image.toLowerCase().includes("assets/images/mates/lost");
    const displayName = escapeHtml(mate.name) + (lostImage ? "*" : "");
    const shiverBadge = isShiver(mate)
      ? `<img class="rarity-shiver-badge" src="assets/images/ui/Shiver.png" alt="Shiver" title="Shiver">`
      : "";
    const assistedSummary = getAssistedSummary(getMateCredits(mate));

    card.innerHTML = `
      ${shiverBadge}
      <img src="${escapeHtml(mate.image || "")}" alt="${escapeHtml(mate.name || "")}">
      <h3>${displayName}</h3>
      ${assistedSummary ? `<p class="uprod-card-note">${escapeHtml(assistedSummary)}</p>` : ""}
    `;

    card.addEventListener("click", () => openDetails(mate));
    return card;
  }

  function openDetails(mate) {
    const idx = visibleMates.findIndex(entry => sameMate(entry, mate));
    currentMateIndex = idx >= 0 ? idx : 0;
    updateDetails(mate);
    modal.classList.remove("hidden");
  }

  function updateDetails(mate) {
    const mateMode = mate.mode || "base";
    const modalContent = document.querySelector("#detailsModal .modal-content") || document.getElementById("detailsModal");
    const credits = getMateCredits(mate);

    applyMateStyle(modalContent, mate);
    setModeBadge(mateMode, mate);

    document.getElementById("mateName").textContent = mate.name || "";
    document.getElementById("mateImage").src = mate.image || "";
    document.getElementById("conceptedByContainer").innerHTML = renderCreditSection("Concepted By", credits.concepted);
    document.getElementById("assistedByContainer").innerHTML = renderAssistedSection(credits.assisted);
    document.getElementById("namedByContainer").innerHTML = renderCreditSection("Named By", credits.named);
    renderEvolutionLine(mate);

    renderAlternateForms(mate);
    renderModeAlternates(mate);
  }

  function renderCreditSection(label, people) {
    return `<b>${escapeHtml(label)}:</b><div>${people.length ? escapeHtml(people.join(", ")) : "Incomplete Info"}</div>`;
  }

  function renderAssistedSection(items) {
    if (!items.length) return `<b>Assisted By:</b><div>Incomplete Info</div>`;
    const rows = items.map(item => {
      const detail = item.how ? `: ${escapeHtml(item.how)}` : "";
      return `<div><strong>${escapeHtml(item.person)}</strong>${detail}</div>`;
    }).join("");
    return `<b>Assisted By:</b>${rows}`;
  }

  function getAssistedSummary(credits) {
    if (!credits?.assisted?.length) return "";
    const withHow = credits.assisted.find(item => item.how);
    if (!withHow) return "";
    if (credits.assisted.length === 1) return `${withHow.person}: ${withHow.how}`;
    return `${withHow.person}: ${withHow.how}`;
  }

  function renderEvolutionLine(mate) {
    const evoContainer = document.getElementById("evolutionsContainer");
    evoContainer.innerHTML = "";
    if ((mate.mode || "base") === "costumes") return;

    const mateMode = mate.mode || "base";
    const modeForms = getMateModePool(mate);
    const byName = new Map(modeForms.map(entry => [entry.name, entry]));
    if (!byName.has(mate.name)) byName.set(mate.name, mate);

    const outgoing = new Map();
    const incoming = new Map();
    modeForms.forEach(entry => {
      (entry.evolvesTo || []).forEach(evo => {
        if (!evo || !evo.name) return;
        if (!outgoing.has(entry.name)) outgoing.set(entry.name, []);
        outgoing.get(entry.name).push({ to: evo.name, level: evo.level, item: evo.Item });

        if (!incoming.has(evo.name)) incoming.set(evo.name, []);
        incoming.get(evo.name).push({ from: entry.name, level: evo.level, item: evo.Item });
      });
    });

    function collectReachableAncestors(startName) {
      const seen = new Set();
      const stack = [startName];
      while (stack.length) {
        const node = stack.pop();
        if (seen.has(node)) continue;
        seen.add(node);
        const parents = incoming.get(node) || [];
        parents.forEach(parent => stack.push(parent.from));
      }
      return seen;
    }

    function findCandidateRoots(startName) {
      const ancestorSet = collectReachableAncestors(startName);
      const roots = [...ancestorSet].filter(name => !(incoming.get(name) || []).length);
      return roots.length ? roots : [startName];
    }

    function buildAllPathsFrom(rootName) {
      const paths = [];
      function dfs(nodeName, names, requirements, seen) {
        const edges = outgoing.get(nodeName) || [];
        if (!edges.length) {
          paths.push({ names: [...names], requirements: [...requirements] });
          return;
        }
        let progressed = false;
        edges.forEach(edge => {
          if (!edge || !edge.to || seen.has(edge.to)) return;
          progressed = true;
          names.push(edge.to);
          requirements.push({ level: edge.level, item: edge.item });
          seen.add(edge.to);
          dfs(edge.to, names, requirements, seen);
          seen.delete(edge.to);
          names.pop();
          requirements.pop();
        });
        if (!progressed) paths.push({ names: [...names], requirements: [...requirements] });
      }
      dfs(rootName, [rootName], [], new Set([rootName]));
      return paths;
    }

    function evolutionRequirementText(requirement) {
      if (!requirement) return "";
      const parts = [];
      if (requirement.level !== null && requirement.level !== undefined && requirement.level !== "") parts.push(`Lvl ${requirement.level}`);
      if (requirement.item !== null && requirement.item !== undefined && String(requirement.item).trim()) parts.push(`Item: ${requirement.item}`);
      return parts.join(" | ");
    }

    const allLines = findCandidateRoots(mate.name)
      .flatMap(rootName => buildAllPathsFrom(rootName))
      .filter(path => path.names.includes(mate.name));
    const seenPathKeys = new Set();
    const lines = allLines.filter(path => {
      const key = path.names.join("->");
      if (seenPathKeys.has(key)) return false;
      seenPathKeys.add(key);
      return true;
    });
    const shouldShowLine = lines.length > 0 && (incoming.has(mate.name) || outgoing.has(mate.name) || lines.some(line => line.names.length > 1));

    if (!shouldShowLine) {
      evoContainer.innerHTML = "<b>Evolution Line:</b><div>Incomplete Info</div>";
      return;
    }

    evoContainer.innerHTML = "<b>Evolution Line:</b><br>";
    lines.forEach(line => {
      const lineEl = document.createElement("div");
      lineEl.className = "evo-line";

      line.names.forEach((name, idx) => {
        const nodeMate = byName.get(name);
        const node = document.createElement("div");
        node.className = "evo-node" + (name === mate.name ? " current" : "");

        const img = document.createElement("img");
        img.src = (nodeMate && nodeMate.image) || "";
        img.alt = name;
        img.title = name;
        if (nodeMate) img.onclick = () => openDetails(nodeMate);

        const label = document.createElement("div");
        label.className = "evo-name";
        label.textContent = name;

        node.appendChild(img);
        node.appendChild(label);
        lineEl.appendChild(node);

        if (idx < line.names.length - 1) {
          const link = document.createElement("div");
          link.className = "evo-link";
          const arrow = document.createElement("div");
          arrow.className = "evo-arrow";
          arrow.textContent = "→";
          const lvl = document.createElement("div");
          lvl.className = "evo-level";
          lvl.textContent = evolutionRequirementText(line.requirements[idx]);
          link.appendChild(arrow);
          link.appendChild(lvl);
          lineEl.appendChild(link);
        }
      });

      evoContainer.appendChild(lineEl);
    });
  }

  function renderAlternateForms(mate) {
    const sacredContainer = document.getElementById("sacredContainer");
    sacredContainer.innerHTML = "";
    const mateMode = mate.mode || "base";
    const mateRef = getResolvedMateRef(mate);
    const sameSpeciesAllTabs = crossTabFormsByRef.get(mateRef) || [];
    const alternateForms = sameSpeciesAllTabs.filter(form => {
      if (form.name === mate.name && form.mode === mateMode) return false;
      if (isMode(form)) return false;
      if (isMode(mate) && (form.mode || "") === mateMode) return false;
      return true;
    });

    if (!alternateForms.length) {
      sacredContainer.innerHTML = "<b>Alternate Forms:</b><div>Incomplete Info</div>";
      return;
    }

    sacredContainer.innerHTML = "<b>Alternate Forms:</b><br>";
    alternateForms.forEach(form => {
      const img = document.createElement("img");
      img.src = form.image || "";
      img.title = `${form.name} (${form.mode})`;
      img.onclick = () => openDetails(form);
      img.style.width = "80px";
      img.style.margin = "4px";
      img.style.border = "2px solid #0ff";
      img.style.borderRadius = "10px";
      img.style.cursor = "pointer";
      sacredContainer.appendChild(img);
    });
  }

  function renderModeAlternates(mate) {
    const modeContainer = document.getElementById("ModeContainer");
    modeContainer.innerHTML = "";
    const mateMode = mate.mode || "base";
    const modeForms = getMateModePool(mate);
    const alternateGroupKey = getAlternateGroupKey(mate);
    const sameSpeciesSameMode = modeForms.filter(form => getAlternateGroupKey(form) === alternateGroupKey);
    const modeOnlyForms = sameSpeciesSameMode.filter(form => {
      if (form.name === mate.name && form.image === mate.image) return false;
      if (mateMode === "npc") return true;
      if (isMode(mate)) return true;
      return isMode(form);
    });

    if (!modeOnlyForms.length) {
      modeContainer.innerHTML = "<b>Alternates:</b><div>Incomplete Info</div>";
      return;
    }

    modeContainer.innerHTML = "<b>Alternates:</b><br>";
    modeOnlyForms.forEach(form => {
      const img = document.createElement("img");
      img.src = form.image || "";
      img.title = `${form.name} (${form.mode})`;
      img.onclick = () => openDetails(form);
      img.style.width = "80px";
      img.style.margin = "4px";
      img.style.border = "2px solid #0ff";
      img.style.borderRadius = "10px";
      img.style.cursor = "pointer";
      modeContainer.appendChild(img);
    });
  }

  function getMateModePool(mate) {
    const mode = mate?.mode || "base";
    if (mode === "event") return (allData.event || []).map(entry => ({ ...entry, mode: "event", sourceMode: entry.sourceMode }));
    return (allData[mode] || []).map(entry => ({ ...entry, mode }));
  }

  function setModeBadge(mode) {
    modeBadge.textContent = mode ? mode.toUpperCase() : "";
  }

  function applyMateStyle(el, mate) {
    if (!el) return;
    el.style.backgroundColor = "";
    el.style.color = "";
    el.style.fontFamily = "";
    el.style.border = "";
    el.style.removeProperty("--outline-color");

    if (mate.event === "halloween") {
      el.style.backgroundColor = "#4B0082";
      el.style.color = "#ff6c1c";
    } else if (mate.event === "winter") {
      el.style.backgroundColor = "#001f4d";
      el.style.color = "#cce6ff";
    } else if (mate.event === "fools") {
      el.style.backgroundColor = "#fff";
      el.style.color = "#000";
      el.style.fontFamily = "Arial, sans-serif";
    }

    const primaryType = mate.types?.[0];
    const typeObj = typesData.find(entry => entry.name === primaryType);
    const outlineColor = typeObj ? typeObj.color : "#ccc";
    el.style.setProperty("--outline-color", outlineColor);
    el.style.border = `3px solid ${outlineColor}`;
  }

  function sameMate(a, b) {
    return (a.name === b.name) && (getResolvedMateRef(a) === getResolvedMateRef(b)) && ((a.mode || "") === (b.mode || ""));
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    }[char]));
  }

  Promise.all([
    fetch("data/types.json").then(response => response.json()).catch(() => []),
    fetch("data/abilities.json").then(response => response.json()).catch(() => []),
    fetch("data/mates/uprod.json").then(response => response.json()).catch(() => []),
    fetch("data/mates/crorder.json").then(response => response.json()).catch(() => []),
    fetch("data/mates/base.json").then(response => response.json()).catch(() => []),
    fetch("data/mates/sacred.json").then(response => response.json()).catch(() => []),
    fetch("data/mates/ace.json").then(response => response.json()).catch(() => []),
    fetch("data/mates/goner.json").then(response => response.json()).catch(() => []),
    fetch("data/mates/ncanon.json").then(response => response.json()).catch(() => []),
    fetch("data/mates/costumes.json").then(response => response.json()).catch(() => []),
    fetch("data/mates/npc.json").then(response => response.json()).catch(() => [])
  ]).then(([types, abilities, credits, crorder, base, sacred, ace, goner, ncanon, costumes, npc]) => {
    typesData = types || [];
    abilitiesData = abilities || [];
    creditsData = Array.isArray(credits) ? credits.map(normalizeCreditsEntry) : [];
    crorderData = Array.isArray(crorder) ? crorder.map(name => String(name || "").trim()).filter(Boolean) : [];
    allData = {
      base: annotateMateOrder("base", base || []),
      sacred: annotateMateOrder("sacred", sacred || []),
      ace: annotateMateOrder("ace", ace || []),
      goner: annotateMateOrder("goner", goner || []),
      ncanon: annotateMateOrder("ncanon", ncanon || []),
      costumes: annotateMateOrder("costumes", costumes || []),
      npc: annotateMateOrder("npc", npc || []),
      event: []
    };

    Object.entries(allData).forEach(([mode, mates]) => {
      if (mode === "event") return;
      allData[mode] = mates.filter(mate => {
        if (mate.event !== undefined && mate.event !== null) {
          mate.mode = "event";
          mate.__mode = "event";
          allData.event.push(mate);
          return false;
        }
        return true;
      });
    });

    annotateMateOrder("event", allData.event);
    rebuildRefIndexes();
    buildCreditsIndex();
    rebuildCrorderRanks();
    populateFilters();
    renderGrid();
  }).catch(error => {
    console.error("Failed to load UPROD data", error);
    grid.innerHTML = `<div class="cat-empty">Failed to load data.</div>`;
  });

  conceptedFilter.addEventListener("change", renderGrid);
  assistedFilter.addEventListener("change", renderGrid);
  namedFilter.addEventListener("change", renderGrid);

  closeModal.onclick = () => modal.classList.add("hidden");
  nextMate.onclick = () => {
    if (!visibleMates.length) return;
    currentMateIndex = (currentMateIndex + 1) % visibleMates.length;
    updateDetails(visibleMates[currentMateIndex]);
  };
  prevMate.onclick = () => {
    if (!visibleMates.length) return;
    currentMateIndex = (currentMateIndex - 1 + visibleMates.length) % visibleMates.length;
    updateDetails(visibleMates[currentMateIndex]);
  };
});
