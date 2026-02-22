let currentMode = "base";
let animatrixData = [];
let allData = {}; // store all JSON data for cross-referencing
let typesData = [];
let abilitiesData = [];
let currentMateIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  const animatrix = document.getElementById("animatrix");
  const gridView = document.getElementById("gridView");
  const listView = document.getElementById("listView");
  const search = document.getElementById("search");

  // custom filter UI elements
  const typeToggle = document.getElementById("typeToggle");
  const typePanel = document.getElementById("typePanel");
  const typeOptionsEl = document.getElementById("typeOptions");
  const clearTypes = document.getElementById("clearTypes");
  const type2Toggle = document.getElementById("type2Toggle");
  const type2Panel = document.getElementById("type2Panel");
  const type2OptionsEl = document.getElementById("type2Options");
  const clearTypes2 = document.getElementById("clearTypes2");

  const paraToggle = document.getElementById("paraToggle");
  const paraPanel = document.getElementById("paraPanel");
  const paraOptionsEl = document.getElementById("paraOptions");
  const clearParas = document.getElementById("clearParas");
  const biomeFilterWrapper = document.getElementById("biomeFilterWrapper");
  const biomeToggle = document.getElementById("biomeToggle");
  const biomePanel = document.getElementById("biomePanel");
  const biomeOptionsEl = document.getElementById("biomeOptions");
  const clearBiomes = document.getElementById("clearBiomes");
  const statusToggle = document.getElementById("statusToggle");
  const statusPanel = document.getElementById("statusPanel");
  const statusOptionsEl = document.getElementById("statusOptions");

  const modal = document.getElementById("detailsModal");
  const closeModal = document.getElementById("closeModal");
  const nextMate = document.getElementById("nextMate");
  const prevMate = document.getElementById("prevMate");
  const modeBadge = document.getElementById("modeBadge");
  const allowedRarities = new Set(["Normal", "Mode", "Shiver", "Paragon"]);
  const databaseModes = ["base", "sacred", "ace", "ncanon", "event"];
  const databaseModeRank = { base: 0, sacred: 1, ace: 2, ncanon: 3, event: 4 };
  const biomeOptions = [
    "Lake",
    "Forest",
    "Desert",
    "River",
    "Mountains",
    "Plains",
    "Circus",
    "Ice-Caps",
    "Volcano",
    "Alcatraz",
    "Jungle",
    "Borgo Slor",
    "Big City",
    "Ocean",
    "Caverns",
    "Swamp",
    "Shiver Co.",
    "I'eland",
    "Factory"
  ];

  function getRarities(mate) {
    const raw = mate?.rarity;
    let list = [];

    if (Array.isArray(raw)) {
      list = raw;
    } else if (typeof raw === "string") {
      list = raw.split(/[,+|/]/g).map(x => x.trim()).filter(Boolean);
    } else if (raw !== undefined && raw !== null) {
      list = [String(raw).trim()];
    }

    const normalized = [];
    list.forEach(r => {
      if (allowedRarities.has(r) && !normalized.includes(r)) normalized.push(r);
    });

    if (!normalized.length) return ["Normal"];
    if (normalized.length > 1) return normalized.filter(r => r !== "Normal");
    return normalized;
  }
  const hasRarity = (mate, rarity) => getRarities(mate).includes(rarity);
  const isMode = mate => hasRarity(mate, "Mode");
  const isShiver = mate => hasRarity(mate, "Shiver");
  const isParagon = mate => hasRarity(mate, "Paragon");

  const isMissingNo = m =>
    m.mode !== "npc" &&
    (
      m.name === "MissingNo" ||
      m.name === "L.MissingNo" ||
      (m.image || "").includes("MissingNo")
    );
  const isOnes = m => m.name === "Ones";
  const isSpecial = m => isMissingNo(m) || isOnes(m);
  const usesNimage = m => /(^|\/)nimages\//i.test(m.image || "");
  const isNpcPlaceholder = m =>
    usesNimage(m) && (m.image || "").toLowerCase().includes("youknowwhoiam");
  const isNpcCreated = m =>
    usesNimage(m) && !isNpcPlaceholder(m);
  const hasImage = m => {
    const imgPath = m.image;
    if (!imgPath) return false;

    const path = imgPath.toLowerCase();

    if (m.mode === "npc") {
      return path.includes("/nimages/") && !path.includes("youknowwhoiam");
    }

    return (
      path.startsWith("images/") ||
      path.startsWith("./images/") ||
      path.includes("/images/")
    );
  };
  const isDesigned = m =>
    m.mode !== "npc" &&
    !isMissingNo(m) &&
    !isOnes(m);
  const isFinalized = m =>
    hasImage(m) && !isSpecial(m);
  const isConceptualized = m =>
    /(^|\/)lostimages\//i.test(m.image || "");

  // mode buttons
  const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));

  // Load types first
  fetch("data/types.json")
    .then(res => res.json())
    .then(types => {
      typesData = types || [];
      populateFilterOptions(typesData, typeOptionsEl);
      populateFilterOptions(typesData, type2OptionsEl);
      populateFilterOptions(typesData, paraOptionsEl);
      populateFilterOptions(biomeOptions, biomeOptionsEl);

      // load abilities and all mode JSONs
      return Promise.all([
        fetch("data/abilities.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/base.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/sacred.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/ace.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/ncanon.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/costumes.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/npc.json").then(r => r.json()).catch(() => []),
      ]);
    })
    .then(([abilities, base, sacred, ace, ncanon, costumes, npc]) => {
        abilitiesData = abilities || [];
        allData = { 
          base: base || [], 
          sacred: sacred || [], 
          ace: ace || [], 
          ncanon: ncanon || [], 
          costumes: costumes || [],
          npc: npc || [],
          event: [] // initialize event
        };

        // now safe to filter and push to event
        Object.entries(allData).forEach(([mode, mates]) => {
          if (mode === "event") return; // skip event itself
          allData[mode] = mates.filter(mate => {
            if (mate.event !== undefined && mate.event !== null) {
              mate.sourceMode = mode;    // preserve original tab for event-specific logic
              mate.mode = "event";       // mark it as event
              allData.event.push(mate);  // add to event list
              return false;             // remove from original mode
            }
            return true; // keep in this mode
          });
        });

        loadMode("base");
      })

    .catch(err => {
      console.error("Failed to load JSON data", err);
    });

    const statsBtn = document.getElementById("statsBtn");
    const statsModal = document.getElementById("statsModal");
    const closeStats = document.getElementById("closeStats");
    const statsContent = document.getElementById("statsContent");

    statsBtn.onclick = () => {
      buildStats();
      statsModal.classList.remove("hidden");
    };

    closeStats.onclick = () => statsModal.classList.add("hidden");

    function buildStats() {
      const hasValidId = m =>
        m &&
        m.id !== null &&
        m.id !== undefined &&
        m.id !== "null";
      const allMons = Object.entries(allData).flatMap(
        ([mode, mons]) => mons.map(m => ({ ...m, mode }))
      );

      // -------------------- MODE STATS --------------------
      const modeList = ["base", "sacred", "ace", "ncanon", "event", "costumes", "npc"];
      let modeHtml = `<section class="stats-section">
        <h2>Mode Stats</h2>
        <div class="mode-stats">`;

        modeList.forEach(mode => {
          const mons = (allData[mode] || []).map(m => ({ ...m, mode }));
          const statsMons = mons.filter(hasValidId);
          let createdCount;
          let finalizedCount;
          let totalCount = statsMons.length;

          if (mode === "npc") {
            const npcMons = statsMons.filter(m => m.image);
            createdCount = npcMons.filter(isNpcCreated).length;
            totalCount = npcMons.length;
          } else {
            createdCount = statsMons.filter(isDesigned).length;
            finalizedCount = statsMons.filter(isFinalized).length;
          }
        modeHtml += `<div class="mode-item">
          <span class="mode-name"><b>${mode.charAt(0).toUpperCase() + mode.slice(1)}</b></span>
          <div class="mode-counts">
            <span>
            ${mode === "npc"
              ? `Created: ${createdCount}/${totalCount}`
              : `Designed: ${createdCount}/${totalCount}, Finalized: ${finalizedCount}/${totalCount}`
            }
          </span>
          </div>
        </div>`;
      });

      modeHtml += `</div></section>`;

    // -------------------- MISSINGNO COUNT (all modes except NPC) --------------------
    const nonNpcMons = Object.values(allData)
      .flat()
      .filter(m => m.mode !== "npc" && hasValidId(m)); // includes event now

    const missingNoMons = nonNpcMons.filter(isMissingNo);
    const missingNoHtml = `<section class="stats-section">
      <p>Total MissingNo: ${missingNoMons.length}/${nonNpcMons.length}</p>
    </section><hr>`;

      // -------------------- TYPING STATS (BASE) --------------------
      const baseMons = (allData.base || []).filter(hasValidId);
      const typeMap = {};

      // First pass: numerators exclude MissingNo, L.MissingNo, Ones
      baseMons.forEach(m => {
        if (!hasImage(m) || isSpecial(m)) return;

        const types = Array.isArray(m.types) ? m.types.filter(t => t) : [];
        const paras = Array.isArray(m.paraTypes) ? m.paraTypes.filter(p => p) : [];

        // Count only primary + secondary types for "All"
        types.forEach((t, i) => {
          if (!typeMap[t]) typeMap[t] = { all: 0, primary: 0, para: 0, allDen: 0, primaryDen: 0, paraDen: 0 };
          typeMap[t].all += 1;
          if (i === 0) typeMap[t].primary += 1;
        });

        // Count Para separately
        paras.forEach(p => {
          if (!typeMap[p]) typeMap[p] = typeMap[p] || { all: 0, primary: 0, para: 0, allDen: 0, primaryDen: 0, paraDen: 0 };
          typeMap[p].para += 1;
        });
      });

      // Second pass: denominators
      Object.keys(typeMap).forEach(type => {
        typeMap[type].allDen = baseMons.filter(m => {
          const types = Array.isArray(m.types) ? m.types.filter(t => t) : [];
          return types.includes(type);
        }).length;

        typeMap[type].primaryDen = baseMons.filter(m => {
          const types = Array.isArray(m.types) ? m.types.filter(t => t) : [];
          return types[0] === type;
        }).length;

        typeMap[type].paraDen = baseMons.filter(m => {
          const paras = Array.isArray(m.paraTypes) ? m.paraTypes.filter(p => p) : [];
          return paras.includes(type);
        }).length;
      });

      // Sort types by 'all' descending
      const sortedTypes = Object.keys(typeMap).sort((a, b) => {
        if (typeMap[b].all !== typeMap[a].all) return typeMap[b].all - typeMap[a].all;
        return typeMap[b].allDen - typeMap[a].allDen; // tie-breaker
      });

      let typeHtml = `<section class="stats-section">
        <h2>Typing Stats (Base)</h2>
        <div class="typing-stats">`;

      sortedTypes.forEach(type => {
        const t = typeMap[type];
        typeHtml += `<div class="type-item">
          <span class="type-name"><b>${type}</b></span>
          <div class="type-counts">
            <span>All: ${t.all}/${t.allDen}</span> |
            <span>Primary: ${t.primary}/${t.primaryDen}</span> |
            <span>Para: ${t.para}/${t.paraDen}</span>
          </div>
        </div>`;
      });

      typeHtml += `</div></section>`;

      statsContent.innerHTML = modeHtml + missingNoHtml + typeHtml;
    }

  function renderCounts(obj, missingCount) {
    if (!obj) return "";

    return Object.entries(obj)
      .filter(([key, value]) => key && key !== "null" && value > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => {
        const max = value + missingCount;
        return `<p><b>${escapeHtml(key)}:</b> ${value}/${max}</p>`;
      })
      .join("");
  }

  // Build checkbox list for a panel
  function populateFilterOptions(types, container) {
    container.innerHTML = "";
    types.forEach(t => {
      const label = typeof t === "string" ? t : t?.name;
      if (!label) return;
      const row = document.createElement("label");
      row.className = "opt";
      row.innerHTML = `<input type="checkbox" value="${escapeHtml(label)}"> <span>${escapeHtml(label)}</span>`;
      container.appendChild(row);
    });
  }

  // Helpers for reading selections
  function getCheckedValues(container) {
    return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(i => i.value);
  }

  function clearCheckboxes(container) {
    container.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = false);
  }

  // Toggle/filter panel open/close
  function setupToggle(toggleBtn, panel) {
    toggleBtn.addEventListener("click", e => {
      e.stopPropagation();
      const open = panel.classList.toggle("open");
      panel.setAttribute("aria-hidden", !open);
    });

    // close on outside click
    document.addEventListener("click", ev => {
      if (!panel.contains(ev.target) && ev.target !== toggleBtn) {
        panel.classList.remove("open");
        panel.setAttribute("aria-hidden", "true");
      }
    });

    // close on Escape
    document.addEventListener("keydown", ev => {
      if (ev.key === "Escape") {
        panel.classList.remove("open");
        panel.setAttribute("aria-hidden", "true");
      }
    });
  }

  setupToggle(typeToggle, typePanel);
  setupToggle(type2Toggle, type2Panel);
  setupToggle(paraToggle, paraPanel);
  setupToggle(biomeToggle, biomePanel);
  setupToggle(statusToggle, statusPanel);

  function getStatusFilterValue() {
    const checked = statusOptionsEl.querySelector('input[name="statusFilter"]:checked');
    return checked ? checked.value : "all";
  }

  function statusPassesFilter(mate) {
    const filter = getStatusFilterValue();
    if (filter === "all") return true;

    const mateWithMode = { ...mate, mode: mate.mode || currentMode };
    if (mateWithMode.mode === "npc") return true;

    if (filter === "missingno") return isMissingNo(mateWithMode);
    if (filter === "designed") return isDesigned(mateWithMode);
    if (filter === "nonfinalized") return isDesigned(mateWithMode) && !isFinalized(mateWithMode);
    if (filter === "conceptualized") return isConceptualized(mateWithMode);
    if (filter === "finalized") return isFinalized(mateWithMode);
    return true;
  }

  // Clear buttons
  clearTypes.addEventListener("click", () => {
    clearCheckboxes(typeOptionsEl);
    renderAnimatrix();
  });
  clearTypes2.addEventListener("click", () => {
    clearCheckboxes(type2OptionsEl);
    renderAnimatrix();
  });
  clearParas.addEventListener("click", () => {
    clearCheckboxes(paraOptionsEl);
    renderAnimatrix();
  });
  clearBiomes.addEventListener("click", () => {
    clearCheckboxes(biomeOptionsEl);
    renderAnimatrix();
  });

  // Wire checkbox changes to re-render
  typeOptionsEl.addEventListener("change", renderAnimatrix);
  type2OptionsEl.addEventListener("change", renderAnimatrix);
  paraOptionsEl.addEventListener("change", renderAnimatrix);
  biomeOptionsEl.addEventListener("change", renderAnimatrix);
  statusOptionsEl.addEventListener("change", renderAnimatrix);

  // Mode switching
  modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      modeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadMode(btn.dataset.mode);
    });
  });

  function hasUsableId(mate) {
    return mate && mate.id !== null && mate.id !== undefined && mate.id !== "null";
  }

  function compareByIdThenName(a, b) {
    const aHasId = hasUsableId(a);
    const bHasId = hasUsableId(b);

    if (aHasId && bHasId) {
      const aId = Number(a.id);
      const bId = Number(b.id);
      if (aId !== bId) return aId - bId;
    } else if (aHasId !== bHasId) {
      return aHasId ? -1 : 1; // keep null/undefined ids at the end
    }

    const aRank = databaseModeRank[a.mode] ?? 999;
    const bRank = databaseModeRank[b.mode] ?? 999;
    if (aRank !== bRank) return aRank - bRank;

    return String(a.name || "").localeCompare(String(b.name || ""));
  }

  function getDatabaseMates() {
    return databaseModes.flatMap(mode =>
      (allData[mode] || []).map(mate => ({ ...mate, mode }))
    );
  }

  function modeSupportsBiomes(mode) {
    return mode === "base" || mode === "event";
  }

  function setBiomeFilterVisibility(mode) {
    const showBiomes = modeSupportsBiomes(mode);
    if (biomeFilterWrapper) biomeFilterWrapper.style.display = showBiomes ? "inline-block" : "none";
    if (!showBiomes) {
      biomePanel.classList.remove("open");
      biomePanel.setAttribute("aria-hidden", "true");
    }
  }

  function getMateBiomes(mate) {
    if (!mate) return [];
    if (Array.isArray(mate.biomes)) return mate.biomes.filter(Boolean);
    if (Array.isArray(mate.biome)) return mate.biome.filter(Boolean);
    if (typeof mate.biome === "string" && mate.biome.trim()) return [mate.biome.trim()];
    if (typeof mate.Biome === "string" && mate.Biome.trim()) return [mate.Biome.trim()];
    return [];
  }

  function biomesPassFilter(mateBiomes, selectedBiomes) {
    if (!Array.isArray(selectedBiomes) || !selectedBiomes.length) return true;
    const biomes = Array.isArray(mateBiomes) ? mateBiomes.filter(Boolean) : [];
    return selectedBiomes.some(b => biomes.includes(b));
  }

  function biomeImagePath(biomeName) {
    if (!biomeName) return "";
    return `webimages/biomes/${encodeURIComponent(String(biomeName).trim())}.png`;
  }

  function loadMode(mode) {
    currentMode = mode;
    setBiomeFilterVisibility(mode);
    const sourceData = mode === "database"
      ? getDatabaseMates()
      : (Array.isArray(allData[mode]) ? allData[mode] : []);
    animatrixData = sourceData.filter(mate => !isMode(mate));
    if (mode === "database") {
      animatrixData = animatrixData.sort(compareByIdThenName);
    }
    renderAnimatrix();
  }

  function renderAnimatrix() {
    animatrix.innerHTML = "";
    const term = (search.value || "").trim().toLowerCase();
    const selectedTypes = getCheckedValues(typeOptionsEl);
    const selectedTypes2 = getCheckedValues(type2OptionsEl);
    const selectedParas = getCheckedValues(paraOptionsEl);
    const selectedBiomes = modeSupportsBiomes(currentMode) ? getCheckedValues(biomeOptionsEl) : [];

    const intersects = (a, b) => Array.isArray(a) && Array.isArray(b) && a.some(x => b.includes(x));
    animatrixData
      .filter(mate => {
        if (!mate) return false;
        if (isMode(mate)) return false;
        if (term && !(mate.name || "").toLowerCase().includes(term)) return false;
        if (selectedTypes.length) {
          if (!mate.types || !intersects(selectedTypes, mate.types)) return false;
        }
        if (selectedTypes2.length) {
          if (!mate.types || !intersects(selectedTypes2, mate.types)) return false;
        }
        if (selectedParas.length) {
          if (!mate.paraTypes || !intersects(selectedParas, mate.paraTypes)) return false;
        }
        if (modeSupportsBiomes(currentMode)) {
          const mateBiomes = getMateBiomes(mate);
          if (!biomesPassFilter(mateBiomes, selectedBiomes)) return false;
        }
        if (!statusPassesFilter(mate)) return false;
        if (currentMode === "npc" && mate.cosmark === "Y") return false;
        return true;
      })
      .forEach(mate => {
        const card = document.createElement("div");
        card.className = "card";
        if (isParagon(mate)) card.classList.add("rarity-paragon");
        const firstBiome = getMateBiomes(mate)[0];
        if (firstBiome) {
          card.classList.add("biome-bg");
          card.style.setProperty("--biome-image", `url('${biomeImagePath(firstBiome)}')`);
        }
        applyMateStyle(card, mate);

        // Determine if it uses lostimages
        const lostImage = mate.image && mate.image.toLowerCase().includes("lostimages");
        const displayName = escapeHtml(mate.name) + (lostImage ? "*" : "");
        const idText = (mate.id === null || mate.id === undefined || mate.id === "null") ? "?" : String(mate.id);
        const shiverBadge = isShiver(mate)
          ? `<img class="rarity-shiver-badge" src="webimages/Shiver.png" alt="Shiver" title="Shiver">`
          : "";

        // Inner HTML for the card
        card.innerHTML = `
          <div class="card-id">${escapeHtml(idText)}</div>
          ${shiverBadge}
          <img src="${escapeHtml(mate.image || '')}" alt="${escapeHtml(mate.name)}">
          <h3>${displayName}</h3>
          ${(mate.event === "fools") ? "" : `
            <div class="types">${(mate.types || []).map(t => typeTag(t)).join("")}</div>
            ${(mate.paraTypes || []).length ? `<div class="types">${mate.paraTypes.map(p => typeTag(p)).join("")}</div>` : ""} 
          `}
        `;

        card.addEventListener("click", () => openDetails(mate));
        animatrix.appendChild(card);
      });
  }

  function getMateModePool(mate) {
    const mode = mate?.mode || currentMode;
    if (mode === "event") {
      return (allData.event || []).map(m => ({ ...m, mode: "event", sourceMode: m.sourceMode }));
    }
    return (allData[mode] || []).map(m => ({ ...m, mode }));
  }

  function typeTag(typeName) {
    const t = typesData.find(x => x.name === typeName);
    return `<span style="background:${t ? t.color : '#ccc'}">${escapeHtml(typeName)}</span>`;
  }

  function mateVitalsHtml(mate) {
    const biomes = getMateBiomes(mate);
    const biomeText = biomes.length ? biomes.map(b => escapeHtml(b)).join(", ") : "Unknown";
    const height = escapeHtml(mate.height || "Unknown");
    const color = escapeHtml(mate.color || "Unknown");
    return `<div class="mate-meta"><p><b>Biomes:</b> ${biomeText}</p><p><b>Height:</b> ${height}</p><p><b>Color:</b> ${color}</p></div>`;
  }

  gridView.addEventListener("click", () => {
    gridView.classList.add("active");
    listView.classList.remove("active");
    animatrix.className = "grid";
    document.body.classList.remove("animatrix-list-view");
  });
  listView.addEventListener("click", () => {
    listView.classList.add("active");
    gridView.classList.remove("active");
    animatrix.className = "list";
    document.body.classList.add("animatrix-list-view");
  });

  search.addEventListener("input", renderAnimatrix);


  const randomMateBtn = document.getElementById("randomMateBtn");

  randomMateBtn.addEventListener("click", () => {
    if (!animatrixData || animatrixData.length === 0) return;

    // Rebuild the currently visible list using the same filters
    const term = (search.value || "").trim().toLowerCase();
    const selectedTypes = getCheckedValues(typeOptionsEl);
    const selectedTypes2 = getCheckedValues(type2OptionsEl);
    const selectedParas = getCheckedValues(paraOptionsEl);
    const selectedBiomes = modeSupportsBiomes(currentMode) ? getCheckedValues(biomeOptionsEl) : [];
    

    const intersects = (a, b) =>
      Array.isArray(a) && Array.isArray(b) && a.some(x => b.includes(x));

    const visibleMates = animatrixData.filter(mate => {
      if (!mate) return false;
      if (isMode(mate)) return false;
      if (term && !(mate.name || "").toLowerCase().includes(term)) return false;
      if (selectedTypes.length) {
        if (!mate.types || !intersects(selectedTypes, mate.types)) return false;
      }
      if (selectedTypes2.length) {
        if (!mate.types || !intersects(selectedTypes2, mate.types)) return false;
      }
      if (selectedParas.length) {
        if (!mate.paraTypes || !intersects(selectedParas, mate.paraTypes)) return false;
      }
      if (modeSupportsBiomes(currentMode)) {
        const mateBiomes = getMateBiomes(mate);
        if (!biomesPassFilter(mateBiomes, selectedBiomes)) return false;
      }
      if (!statusPassesFilter(mate)) return false;
      if (currentMode === "npc" && mate.cosmark === "Y") return false;
      return true;
    });

    if (!visibleMates.length) return;

    const randomIndex = Math.floor(Math.random() * visibleMates.length);
    currentMateIndex = randomIndex;

    openDetails(visibleMates[randomIndex]);
  });


  // Details modal logic
  function openDetails(mate) {
    // set mode badge and activate mode button if possible
    const mateMode = mate.mode || currentMode;
    setModeBadge(mateMode, mate);
    if (currentMode !== "database") {
      activateModeButton(mateMode);
    }

    // set currentMateIndex to the index within the current filtered animatrixData, if present
    const idx = animatrixData.findIndex(m => m.name === mate.name && (m.id === mate.id || !mate.id));
    currentMateIndex = idx >= 0 ? idx : 0;

    updateDetails(mate);
    modal.classList.remove("hidden");
  }

  function applyMateStyle(el, mate) {
    if (!el) return;

    // reset
    el.style.backgroundColor = "";
    el.style.color = "";
    el.style.fontFamily = "";
    el.style.border = "";
    el.style.removeProperty("--outline-color");

    // event styles
    if (mate.event === "halloween") {
      el.style.backgroundColor = "#4B0082";
      el.style.color = "#ff6c1c";
    } 
    else if (mate.event === "winter") {
      el.style.backgroundColor = "#001f4d";
      el.style.color = "#cce6ff";
    } 
    else if (mate.event === "fools") {
      el.style.backgroundColor = "#fff";
      el.style.color = "#000";
      el.style.fontFamily = "Arial, sans-serif";
    }

    // primary type border
    const primaryType = mate.types?.[0];
    const typeObj = typesData.find(t => t.name === primaryType);
    const outlineColor = typeObj ? typeObj.color : "#ccc";
    el.style.setProperty("--outline-color", outlineColor);
    el.style.border = `3px solid ${outlineColor}`;
  }


  function updateDetails(mate) {
    const modalContent =
    document.querySelector("#detailsModal .modal-content") ||
    document.getElementById("detailsModal");
    applyMateStyle(modalContent, mate);
    setModeBadge(mate.mode || currentMode, mate);
    document.getElementById("mateName").textContent = mate.name || "";
    document.getElementById("mateImage").src = mate.image || "";
    document.getElementById("mateVitals").innerHTML = mateVitalsHtml(mate);

    // Types (hide for NPCs)
    document.getElementById("mateTypes").innerHTML = currentMode !== "npc"
      ? (mate.types || []).map(t => typeTag(t)).join("")
      : "";

    // Tabs
    const tabsContainer = document.querySelector(".dex-tabs");
    tabsContainer.innerHTML = "";

    if (currentMode === "npc") {
      document.getElementById("abilityContainer").innerHTML = "";
      document.getElementById("paraTypesContainer").innerHTML = "";
      document.getElementById("evolutionsContainer").innerHTML = "";
      const tabsContainer = document.querySelector(".dex-tabs");
      tabsContainer.innerHTML = "";
      const npcHtml = `
          <div><strong>Description: </strong>${escapeHtml(mate.Description || "None")}</div>
          <div><strong>Quest:</strong> ${escapeHtml(mate.quest || "None")}</div>
          <div><strong>Reference:</strong> ${escapeHtml(mate.reference || "None")}</div>
      `;
      document.getElementById("mateDexText").innerHTML = npcHtml;
    }
    else {
      let tabNames = ["Discovered", "First Caught", "Experienced", "Reverense"];
      if (currentMode === "costumes") tabNames = ["Store", "Catalog", "Reverense"];

      tabNames.forEach((name, idx) => {
        const tabBtn = document.createElement("button");
        tabBtn.className = "dex-tab";
        if (idx === 0) tabBtn.classList.add("active");
        tabBtn.dataset.entry = name;
        tabBtn.textContent = name;

        tabBtn.onclick = () => {
          document.querySelectorAll(".dex-tab").forEach(t => t.classList.remove("active"));
          tabBtn.classList.add("active");

          let text = "";
          if (currentMode === "costumes") {
            if (name === "Store") text = mate.store || "No entry yet.";
            else if (name === "Catalog") text = mate.catalog || mate.description || "No entry yet.";
            else text = mate.reverense || "No entry yet";
          } else {
            text = mate.dexEntries ? (mate.dexEntries[name] || mate.description) : mate.description;
          }

          document.getElementById("mateDexText").textContent = text;
        };

        tabsContainer.appendChild(tabBtn);
      });

      // show first tab content immediately
      tabsContainer.querySelector(".dex-tab").click();

      // Abilities container
      const abilityContainer = document.getElementById("abilityContainer");
      abilityContainer.innerHTML = "";
      if (mate.ability) {
        const ab = abilitiesData.find(a => a.name === mate.ability);
        abilityContainer.innerHTML = ab
          ? `<b>Ability:</b><div style="margin-top:6px;"><strong>${escapeHtml(ab.name)}</strong> &mdash; ${escapeHtml(ab.text)}</div>`
          : `<b>Ability:</b> <div>${escapeHtml(mate.ability)}</div>`;
      }

      // Para types
      const paraContainer = document.getElementById("paraTypesContainer");
      paraContainer.innerHTML = mate.paraTypes ? `<b>Para Types:</b> ${mate.paraTypes.map(p => typeTag(p)).join("")}` : "";

      // Evolution line (previous + current + next, same mode)
      const evoC = document.getElementById("evolutionsContainer");
      evoC.innerHTML = "";
      const mateMode = mate.mode || currentMode;
      const modeForms = getMateModePool(mate);
      const byName = new Map(modeForms.map(m => [m.name, m]));
      if (!byName.has(mate.name)) byName.set(mate.name, mate);

      const outgoing = new Map();
      const incoming = new Map();
      modeForms.forEach(m => {
        (m.evolvesTo || []).forEach(e => {
          if (!e || !e.name) return;
          if (!outgoing.has(m.name)) outgoing.set(m.name, []);
          outgoing.get(m.name).push({ to: e.name, level: e.level });

          if (!incoming.has(e.name)) incoming.set(e.name, []);
          incoming.get(e.name).push({ from: m.name, level: e.level });
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
          parents.forEach(p => stack.push(p.from));
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
        function dfs(nodeName, names, levels, seen) {
          const edges = outgoing.get(nodeName) || [];
          if (!edges.length) {
            paths.push({ names: [...names], levels: [...levels] });
            return;
          }
          let progressed = false;
          edges.forEach(edge => {
            if (!edge || !edge.to || seen.has(edge.to)) return;
            progressed = true;
            names.push(edge.to);
            levels.push(edge.level);
            seen.add(edge.to);
            dfs(edge.to, names, levels, seen);
            seen.delete(edge.to);
            names.pop();
            levels.pop();
          });
          if (!progressed) {
            paths.push({ names: [...names], levels: [...levels] });
          }
        }
        dfs(rootName, [rootName], [], new Set([rootName]));
        return paths;
      }

      const allLines = findCandidateRoots(mate.name)
        .flatMap(root => buildAllPathsFrom(root))
        .filter(path => path.names.includes(mate.name));
      const seenPathKeys = new Set();
      const lines = allLines.filter(path => {
        const key = path.names.join("->");
        if (seenPathKeys.has(key)) return false;
        seenPathKeys.add(key);
        return true;
      });
      const shouldShowLine = lines.length > 0 && (incoming.has(mate.name) || outgoing.has(mate.name) || lines.some(l => l.names.length > 1));

      if (shouldShowLine) {
        evoC.innerHTML = "<b>Evolution Line:</b><br>";
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
              lvl.textContent = line.levels[idx] == null || line.levels[idx] === "" ? "Level" : `Lvl ${line.levels[idx]}`;
              link.appendChild(arrow);
              link.appendChild(lvl);
              lineEl.appendChild(link);
            }
          });

          evoC.appendChild(lineEl);
        });
      }
    }

    // Alternate Forms: same id across all tabs, excluding Mode entries
    const sacredC = document.getElementById("sacredContainer");
    sacredC.innerHTML = "";
    const mateMode = mate.mode || currentMode;
    const modeForms = getMateModePool(mate);
    const hasValidId = mate.id !== undefined && mate.id !== null;
    if (hasValidId) {
      const allForms = Object.entries(allData).flatMap(([mode, mates]) => (mates || []).map(m => ({ ...m, mode })));
      const sameSpeciesAllTabs = allForms.filter(f => f.id === mate.id);
      const alternateForms = sameSpeciesAllTabs.filter(f => {
        if (f.name === mate.name && f.mode === mateMode) return false;
        if (isMode(f)) return false;
        if (isMode(mate) && (f.mode || "") === mateMode) return false;
        return true;
      });

      if (alternateForms.length) {
        sacredC.innerHTML = "<b>Alternate Forms:</b><br>";
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
          sacredC.appendChild(img);
        });
      }
    }

    // Alternates: same tab + same id, Mode entries only
    const ModeC = document.getElementById("ModeContainer");
    ModeC.innerHTML = "";
    if (hasValidId) {
      const sameSpeciesSameMode = modeForms.filter(f => f.id === mate.id);
      const modeOnlyForms = sameSpeciesSameMode.filter(f => {
        if (f.name === mate.name && f.image === mate.image) return false;
        if (isMode(mate)) return true;
        return isMode(f);
      });

      if (modeOnlyForms.length) {
        ModeC.innerHTML = "<b>Alternates:</b><br>";
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
          ModeC.appendChild(img);
        });
      }
    }
  }


  // Mode badge + auto-activate mode button
  function setModeBadge(mode, mate) {
    const rarityText = getRarities(mate).join("+");
    modeBadge.textContent = mode ? `${mode.toUpperCase()} | ${rarityText}` : rarityText;
  }
  function activateModeButton(mode) {
    const match = modeButtons.find(b => b.dataset.mode === mode);
    if (match) {
      modeButtons.forEach(b => b.classList.remove("active"));
      match.classList.add("active");
      loadMode(mode);
    }
  }

  closeModal.onclick = () => modal.classList.add("hidden");

  nextMate.onclick = () => {
    if (!animatrixData || animatrixData.length === 0) return;
    currentMateIndex = (currentMateIndex + 1) % animatrixData.length;
    updateDetails(animatrixData[currentMateIndex]);
  };
  prevMate.onclick = () => {
    if (!animatrixData || animatrixData.length === 0) return;
    currentMateIndex = (currentMateIndex - 1 + animatrixData.length) % animatrixData.length;
    updateDetails(animatrixData[currentMateIndex]);
  };

  // small HTML escape
  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, s => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[s]));
  }

});
