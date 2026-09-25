/* eslint-disable no-unused-vars */
import { useEffect } from 'react'
import { buildEvolutionStageIndex, fetchMateBuckets, getBiomeImagePath } from '../../utils/mateData'

const pageStyles = ""

export default function AnimatrixPage() {
  useEffect(() => {
    document.title = "Animatrix"
    document.body.className = "animatrix-page"
    document.body.setAttribute('style', "")

    let currentMode = "base";
    let animatrixData = [];
    let allData = {}; // store all JSON data for cross-referencing
    let typesData = [];
    let abilitiesData = [];
    let currentMateIndex = 0;
    let currentDetailMate = null;
    let listCostumeMode = false;
    let listCostumeReturnMode = "base";
    let listCostumeSourceMate = null;
    let rightClickSearchId = "";
    let idOrderRank = new Map();
    let fallbackIdOrder = 0;
    let fallbackIdOrderByKey = new Map();
    let sortMode = "id";
    let subBiomeOptionsByBiome = {};
    let versionInfoByName = new Map();
    let evolutionStageIndexes = new Map();

      const animatrix = document.getElementById("animatrix");
      const gridView = document.getElementById("gridView");
      const listView = document.getElementById("listView");
      const listModeActions = document.getElementById("listModeActions");
      const search = document.getElementById("search");

      // custom filter UI elements
      const typeFilterWrapper = document.getElementById("typeFilterWrapper");
      const typeToggle = document.getElementById("typeToggle");
      const typePanel = document.getElementById("typePanel");
      const typeOptionsEl = document.getElementById("typeOptions");
      const clearTypes = document.getElementById("clearTypes");
      const type2FilterWrapper = document.getElementById("type2FilterWrapper");
      const type2Toggle = document.getElementById("type2Toggle");
      const type2Panel = document.getElementById("type2Panel");
      const type2OptionsEl = document.getElementById("type2Options");
      const clearTypes2 = document.getElementById("clearTypes2");

      const paraFilterWrapper = document.getElementById("paraFilterWrapper");
      const paraToggle = document.getElementById("paraToggle");
      const paraPanel = document.getElementById("paraPanel");
      const paraOptionsEl = document.getElementById("paraOptions");
      const clearParas = document.getElementById("clearParas");
      const versionToggle = document.getElementById("versionToggle");
      const versionPanel = document.getElementById("versionPanel");
      const versionOptionsEl = document.getElementById("versionOptions");
      const clearVersions = document.getElementById("clearVersions");
      const databaseTabFilterWrapper = document.getElementById("databaseTabFilterWrapper");
      const databaseTabToggle = document.getElementById("databaseTabToggle");
      const databaseTabPanel = document.getElementById("databaseTabPanel");
      const databaseTabOptionsEl = document.getElementById("databaseTabOptions");
      const clearDatabaseTabs = document.getElementById("clearDatabaseTabs");
      const biomeFilterWrapper = document.getElementById("biomeFilterWrapper");
      const biomeToggle = document.getElementById("biomeToggle");
      const biomePanel = document.getElementById("biomePanel");
      const biomeOptionsEl = document.getElementById("biomeOptions");
      const clearBiomes = document.getElementById("clearBiomes");
      const subBiomeFilterWrapper = document.getElementById("subBiomeFilterWrapper");
      const subBiomeToggle = document.getElementById("subBiomeToggle");
      const subBiomePanel = document.getElementById("subBiomePanel");
      const subBiomeOptionsEl = document.getElementById("subBiomeOptions");
      const clearSubBiomes = document.getElementById("clearSubBiomes");
      const foundFilterWrapper = document.getElementById("foundFilterWrapper");
      const foundToggle = document.getElementById("foundToggle");
      const foundPanel = document.getElementById("foundPanel");
      const foundOptionsEl = document.getElementById("foundOptions");
      const clearFound = document.getElementById("clearFound");
      const statusFilterWrapper = document.getElementById("statusFilterWrapper");
      const statusToggle = document.getElementById("statusToggle");
      const statusPanel = document.getElementById("statusPanel");
      const statusOptionsEl = document.getElementById("statusOptions");
      const stageFilterWrapper = document.getElementById("stageFilterWrapper");
      const stageToggle = document.getElementById("stageToggle");
      const stagePanel = document.getElementById("stagePanel");
      const stageOptionsEl = document.getElementById("stageOptions");
      const idSortView = document.getElementById("idSortView");
      const appearanceSortView = document.getElementById("appearanceSortView");
      const animatrixSubtitle = document.getElementById("animatrixSubtitle");
      const searchHelpButton = document.getElementById("searchHelpButton");
      const searchResultCount = document.getElementById("searchResultCount");
      const searchHelpModal = document.getElementById("searchHelpModal");
      const closeSearchHelpButton = document.getElementById("closeSearchHelp");

      const modal = document.getElementById("detailsModal");
      const closeModal = document.getElementById("closeModal");
      const nextMate = document.getElementById("nextMate");
      const prevMate = document.getElementById("prevMate");
      const modeBadge = document.getElementById("modeBadge");
      const allowedRarities = new Set(["Normal", "Mode", "Shiver", "Paragon"]);
      const eventOrder = { winter: 0, fools: 1, halloween: 2, anti: 3 };
      const databaseModes = ["base", "sacred", "ace", "goner", "event", "costumes", "npc"];
      const databaseModeLabels = {
        base: "Base",
        sacred: "Sacred",
        ace: "Ace",
        goner: "Goner",
        event: "Event",
        costumes: "Costumes",
        npc: "NPCs"
      };
      const databaseModeRank = { base: 0, sacred: 1, ace: 2, goner: 3, event: 4, costumes: 5, npc: 6 };

      function closeSearchHelp() {
        searchHelpModal.classList.add("hidden");
        searchHelpButton.setAttribute("aria-expanded", "false");
      }

      searchHelpButton.addEventListener("click", event => {
        event.stopPropagation();
        searchHelpModal.classList.remove("hidden");
        searchHelpButton.setAttribute("aria-expanded", "true");
      });

      closeSearchHelpButton.addEventListener("click", closeSearchHelp);
      searchHelpModal.addEventListener("click", event => {
        if (event.target === searchHelpModal) closeSearchHelp();
      });

      document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !searchHelpModal.classList.contains("hidden")) closeSearchHelp();
      });
      let biomeOptions = [
        "Lake",
        "Forest",
        "Desert",
        "River",
        "Mountains",
        "Plains",
        "Circus",
        "Dead Zone",
        "Ice-Caps",
        "Ranch",
        "Volcano",
        "Axo-Skerry",
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
      let versionOptions = [];
      let crossTabFormsByRef = new Map();
      let mateByName = new Map();

      function normalizeOrderName(name) {
        return String(name || "").trim().replace(/\s*\([^)]*\)\s*$/g, "").toLowerCase();
      }

      function rebuildIdOrderRank(orderData) {
        idOrderRank = new Map();
        fallbackIdOrder = 0;
        fallbackIdOrderByKey = new Map();
        (Array.isArray(orderData) ? orderData : []).forEach((name, index) => {
          const normalized = normalizeOrderName(name);
          if (!normalized || idOrderRank.has(normalized)) return;
          idOrderRank.set(normalized, index);
        });
      }

      function getFallbackIdOrder(mate) {
        const key = [
          normalizeOrderName(mate?.name),
          normalizeOrderName(mate?.ref),
          normalizeOrderName(mate?.__groupName),
          mate?.mode || mate?.__mode || ""
        ].join("|");
        if (!fallbackIdOrderByKey.has(key)) {
          fallbackIdOrderByKey.set(key, idOrderRank.size + fallbackIdOrder);
          fallbackIdOrder += 1;
        }
        return fallbackIdOrderByKey.get(key);
      }

      function getConfiguredIdOrder(mate) {
        const candidates = [mate?.name, mate?.ref, mate?.__groupName];
        for (const candidate of candidates) {
          const rank = idOrderRank.get(normalizeOrderName(candidate));
          if (Number.isInteger(rank)) {
            mate.__hasConfiguredIdOrder = true;
            return rank;
          }
        }
        mate.__hasConfiguredIdOrder = false;
        return getFallbackIdOrder(mate);
      }

      function annotateMateOrder(mode, mates) {
        (mates || []).forEach((mate, index) => {
          mate.__mode = mode;
          mate.__order = index;
          mate.__idOrder = getConfiguredIdOrder(mate);
        });
        return mates || [];
      }

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
      function getParagonOf(mate) {
        return String(mate?.paragonOf || "").trim();
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
          (m.image || "").includes("MissingNo") ||
          (m.mode === "goner" && (m.image || "").toLowerCase().includes("mois.png"))
        );
      const isOnes = m => m.name === "Ones";
      const isSpecial = m => isMissingNo(m) || isOnes(m);
      const usesNimage = m => /(^|\/)assets\/images\/mates\/npc\//i.test(m.image || "");
      const isNpcPlaceholder = m =>
        usesNimage(m) && (m.image || "").toLowerCase().includes("youknowwhoiam");
      const isNpcCreated = m =>
        usesNimage(m) && !isNpcPlaceholder(m);
      const hasImage = m => {
        const imgPath = m.image;
        if (!imgPath) return false;

        const path = imgPath.toLowerCase();

        if (m.mode === "npc") {
          return path.includes("/assets/images/mates/npc/") && !path.includes("youknowwhoiam");
        }

        return (
          path.startsWith("assets/images/mates/base/") ||
          path.startsWith("./assets/images/mates/base/") ||
          path.includes("/assets/images/mates/base/")
        );
      };
      const isDesigned = m =>
        m.mode !== "npc" &&
        !isMissingNo(m) &&
        !isOnes(m);
      const isFinalized = m =>
        hasImage(m) && !isSpecial(m);
      const isConceptualized = m =>
        /(^|\/)assets\/images\/mates\/lost\//i.test(m.image || "");

      function getMateVersions(mate) {
        if (!mate) return [];
        if (typeof mate.firstScannableUpdate === "string" && mate.firstScannableUpdate.trim()) return [normalizeVersionLabel(mate.firstScannableUpdate)];
        if (Array.isArray(mate.versions)) return mate.versions.filter(Boolean).map(v => normalizeVersionLabel(v)).filter(Boolean);
        if (typeof mate.versions === "string" && mate.versions.trim()) return [normalizeVersionLabel(mate.versions)];
        if (Array.isArray(mate.version)) return mate.version.filter(Boolean).map(v => normalizeVersionLabel(v)).filter(Boolean);
        if (typeof mate.version === "string" && mate.version.trim()) return [normalizeVersionLabel(mate.version)];
        if (typeof mate.Version === "string" && mate.Version.trim()) return [normalizeVersionLabel(mate.Version)];
        return [];
      }

      function normalizeVersionLabel(label) {
        return String(label || "").trim().replace(/^Demo\s+/i, "Update ");
      }

      function getVersionSortValue(label) {
        const normalized = normalizeVersionLabel(label);
        const match = normalized.match(/^Update\s+(\d+(?:\.\d+)?)$/i);
        if (!match) return Number.POSITIVE_INFINITY;
        const value = Number(match[1]);
        return value === 0 ? 999 : value;
      }

      function compareVersionLabels(a, b) {
        const aLabel = normalizeVersionLabel(typeof a === "string" ? a : a?.name || "");
        const bLabel = normalizeVersionLabel(typeof b === "string" ? b : b?.name || "");
        const aValue = getVersionSortValue(aLabel);
        const bValue = getVersionSortValue(bLabel);
        if (Number.isFinite(aValue) && Number.isFinite(bValue) && aValue !== bValue) return aValue - bValue;
        if (Number.isFinite(aValue) !== Number.isFinite(bValue)) return Number.isFinite(aValue) ? -1 : 1;
        return aLabel.localeCompare(bLabel);
      }

      function rebuildVersionOptions() {
        const labels = new Set(versionInfoByName.keys());
        ["base", "sacred", "ace", "goner", "event", "costumes", "npc"].forEach(mode => {
          (allData[mode] || []).forEach(mate => {
            getMateVersions(mate).forEach(version => labels.add(version));
          });
        });
        versionOptions = Array.from(labels).sort(compareVersionLabels);
      }

      function rebuildVersionInfo(versions) {
        versionInfoByName = new Map();
        (Array.isArray(versions) ? versions : []).forEach(version => {
          const name = normalizeVersionLabel(typeof version === "string" ? version : version?.name);
          if (!name) return;
          versionInfoByName.set(name, typeof version === "object" ? version : { name });
        });
      }

      // mode buttons
      const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));

      function isListViewActive() {
        return document.body.classList.contains("animatrix-list-view");
      }

      function shouldHideMateId(mate) {
        const mode = mate?.mode || mate?.__mode || currentMode;
        return mode === "npc" || mode === "ncanon" || getEventKey(mate) === "anti";
      }

      function formatListCardId(mate) {
        if (shouldHideMateId(mate)) return "";
        const displayId = getMateDisplayId(mate);
        if (displayId === null) return "????";
        const sign = displayId < 0 ? "-" : "";
        return `${sign}${String(Math.abs(displayId)).padStart(4, "0")}`;
      }

      function normalizeSearchId(term) {
        const normalized = String(term || "").trim();
        if (!/^-?\d+$/.test(normalized)) return null;
        return Number(normalized);
      }

      function mateMatchesSearch(mate, term) {
        if (!term) return true;

        const absoluteStage = term.match(/^([1-3])\*$/);
        if (absoluteStage) {
          return getEvolutionStageInfo(mate).stages.has(Number(absoluteStage[1]));
        }

        const linePosition = term.match(/^(\d+)\/(\d+)$/);
        if (linePosition) {
          const position = Number(linePosition[1]);
          const length = Number(linePosition[2]);
          if (position < 1 || length < 1 || position > length) return false;
          return getEvolutionStageInfo(mate).positions.has(`${position}/${length}`);
        }

        const searchId = normalizeSearchId(term);
        if (searchId !== null) {
          return getMateDisplayId(mate) === searchId;
        }

        return (mate.name || "").toLowerCase().includes(term);
      }

      function showVariationsById(mate) {
        const displayId = getMateDisplayId(mate);
        if (displayId === null) return;

        rightClickSearchId = String(displayId);
        search.value = rightClickSearchId;
        listCostumeMode = false;
        listCostumeSourceMate = null;
        loadMode(currentMode);
        search.focus();
      }

      function isRightClickSearchActive() {
        return rightClickSearchId && (search.value || "").trim() === rightClickSearchId;
      }

      function setMainModeButton(mode) {
        const match = modeButtons.find(b => b.dataset.mode === mode);
        if (!match) return;
        modeButtons.forEach(b => b.classList.remove("active"));
        match.classList.add("active");
      }

      function findRelatedModeMate(mate, mode) {
        if (!mate || !Array.isArray(allData[mode])) return null;
        const mateRef = getResolvedMateRef(mate);
        const forms = crossTabFormsByRef.get(mateRef) || [];
        const exact = forms.find(form => form.mode === mode && !isMode(form));
        if (exact) return exact;

        const ref = getMateRef(mate);
        return allData[mode]
          .map(form => ({ ...form, mode }))
          .find(form => !isMode(form) && (getMateRef(form) === ref || getResolvedMateRef(form) === mateRef)) || null;
      }

      function getRelatedCostumes(mate) {
        if (!mate || !Array.isArray(allData.costumes)) return [];
        const mateRef = getResolvedMateRef(mate);
        const ownRef = getMateRef(mate);
        return allData.costumes
          .map(form => ({ ...form, mode: "costumes" }))
          .filter(form => {
            if (isMode(form)) return false;
            const costumeRef = getMateRef(form);
            return costumeRef === mateRef || costumeRef === ownRef || getResolvedMateRef(form) === mateRef;
          })
          .sort(compareByDisplayOrder);
      }

      function switchToRelatedMode(mode) {
        const targetMate = findRelatedModeMate(currentDetailMate, mode);
        if (!targetMate) return;
        listCostumeMode = false;
        listCostumeSourceMate = null;
        openDetails(targetMate);
      }

      function updateListModeActions() {
        if (!listModeActions) return;
        listModeActions.hidden = !isListViewActive();
        if (listModeActions.hidden) return;

        listModeActions.innerHTML = "";
        if (listCostumeMode) {
          const closeBtn = document.createElement("button");
          closeBtn.type = "button";
          closeBtn.textContent = "X";
          closeBtn.title = "Close costume list";
          closeBtn.addEventListener("click", () => {
            const sourceMate = listCostumeSourceMate;
            listCostumeMode = false;
            listCostumeSourceMate = null;
            loadMode("base");
            setMainModeButton("base");
            if (sourceMate) openDetails(sourceMate);
          });
          listModeActions.appendChild(closeBtn);
          return;
        }

        const detailMode = currentDetailMate?.mode || currentMode;
        const actions = [];
        if (detailMode === "sacred" || detailMode === "ace" || detailMode === "costumes") {
          actions.push({ label: "Base", mode: "base" });
        }
        if (detailMode !== "sacred") {
          actions.push({ label: "Sacred", mode: "sacred" });
        }
        if (detailMode !== "ace") {
          actions.push({ label: "Ace", mode: "ace" });
        }
        actions.push({ label: "Costumes", mode: "costumes" });

        actions.forEach(action => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = action.label;
          if (action.mode !== "costumes" && !findRelatedModeMate(currentDetailMate, action.mode)) {
            btn.disabled = true;
          }
          if (action.mode === "costumes" && !getRelatedCostumes(currentDetailMate).length) {
            btn.disabled = true;
          }
          btn.addEventListener("click", () => {
            if (action.mode === "costumes") {
              if (!currentDetailMate) return;
              listCostumeMode = true;
              listCostumeReturnMode = currentMode === "costumes" ? (listCostumeReturnMode || "base") : currentMode;
              listCostumeSourceMate = currentDetailMate;
              loadMode("costumes");
              setMainModeButton("costumes");
              updateListModeActions();
              return;
            }

            switchToRelatedMode(action.mode);
          });
          listModeActions.appendChild(btn);
        });
      }

      // Load shared ordering/info first
      fetch("data/info.json")
        .then(res => res.json())
        .then(info => {
          const infoTypings = Array.isArray(info?.typings) ? info.typings : [];
          typesData = infoTypings;
          if (Array.isArray(info?.biomes) && info.biomes.length) {
            biomeOptions = info.biomes;
          }
          subBiomeOptionsByBiome = info?.subBiomes && typeof info.subBiomes === "object" ? info.subBiomes : {};
          rebuildVersionInfo(info?.versions);
          populateFilterOptions(typesData, typeOptionsEl);
          populateFilterOptions(typesData, type2OptionsEl);
          populateFilterOptions(typesData, paraOptionsEl);
          populateFilterOptions(databaseModes.map(mode => ({ name: databaseModeLabels[mode], value: mode })), databaseTabOptionsEl);
          populateFilterOptions(biomeOptions, biomeOptionsEl);

          // load abilities and all mode JSONs
          return Promise.all([
            fetch("data/abilities.json").then(r => r.json()).catch(() => []),
            fetchMateBuckets(),
            fetch("data/mates/idorder.json").then(r => r.json()).catch(() => []),
          ]);
        })
        .then(([abilities, mateBuckets, idOrder]) => {
            abilitiesData = abilities || [];
            rebuildIdOrderRank(idOrder);
            allData = { 
              base: annotateMateOrder("base", mateBuckets.base || []), 
              sacred: annotateMateOrder("sacred", mateBuckets.sacred || []), 
              ace: annotateMateOrder("ace", mateBuckets.ace || []), 
              goner: annotateMateOrder("goner", mateBuckets.goner || []),
              ncanon: annotateMateOrder("ncanon", mateBuckets.ncanon || []), 
              costumes: annotateMateOrder("costumes", mateBuckets.costumes || []),
              npc: annotateMateOrder("npc", mateBuckets.npc || []),
              evolution: mateBuckets.evolution || {},
              event: [] // initialize event
            };

            // now safe to filter and push to event
            Object.entries(allData).forEach(([mode, mates]) => {
              if (mode === "event" || mode === "evolution") return; // skip non-display pools
              allData[mode] = mates.filter(mate => {
                if (mate.event !== undefined && mate.event !== null) {
                  mate.sourceMode = mode;    // preserve original tab for event-specific logic
                  mate.mode = "event";       // mark it as event
                  mate.__mode = "event";
                  allData.event.push(mate);  // add to event list
                  return false;             // remove from original mode
                }
                return true; // keep in this mode
              });
            });

            annotateMateOrder("event", allData.event);
            rebuildRefIndexes();
            rebuildEvolutionStageIndexes();
            rebuildVersionOptions();
            populateFilterOptions(versionOptions, versionOptionsEl);
            populateFilterOptions(getNpcFoundOptions(), foundOptionsEl);

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
        modal.addEventListener("click", event => {
          if (event.target === modal) modal.classList.add("hidden");
        });
        statsModal.addEventListener("click", event => {
          if (event.target === statsModal) statsModal.classList.add("hidden");
        });

        function getVisibleCardMates() {
          return Array.from(animatrix.querySelectorAll(".card"))
            .map(card => card.__mate)
            .filter(Boolean);
        }

        function buildStats() {
          const hasValidId = m => getMateDisplayId(m) !== null;
          const statsMode = currentMode;
          const statsModeLabel = statsMode === "database" ? "Database" : (databaseModeLabels[statsMode] || statsMode || "Current");
          const statsPool = getVisibleCardMates();

          // -------------------- MODE STATS --------------------
          let modeHtml = `<section class="stats-section">
            <h2>${escapeHtml(statsModeLabel)} Stats</h2>
            <div class="mode-stats">`;

          const statsMons = statsMode === "npc"
            ? statsPool.filter(m => usesNimage(m))
            : statsPool.filter(m => statsMode === "costumes" || hasValidId(m));
          const totalCount = statsMons.length;
          const createdCount = statsMode === "npc"
            ? statsMons.filter(isNpcCreated).length
            : statsMons.filter(isDesigned).length;
          const finalizedCount = statsMode === "npc"
            ? 0
            : statsMons.filter(isFinalized).length;

            modeHtml += `<div class="mode-item">
              <span class="mode-name"><b>${escapeHtml(statsModeLabel)}</b></span>
              <div class="mode-counts">
                <span>
                ${statsMode === "npc"
                  ? `Created: ${createdCount}/${totalCount}`
                  : `Designed: ${createdCount}/${totalCount}, Finalized: ${finalizedCount}/${totalCount}`
                }
              </span>
              </div>
            </div>`;

          modeHtml += `</div></section>`;

        // -------------------- MISSINGNO COUNT (current mode) --------------------
        const nonNpcMons = statsPool.filter(m => m.mode !== "npc" && hasValidId(m));

        const missingNoMons = nonNpcMons.filter(isMissingNo);
        const highestId = statsPool
          .map(m => getMateDisplayId(m))
          .filter(id => Number.isFinite(id))
          .reduce((max, id) => Math.max(max, id), Number.NEGATIVE_INFINITY);
        const missingNoHtml = `<section class="stats-section">
          <p>Current Highest ID: ${Number.isFinite(highestId) ? highestId : "None"}</p>
          <p>Total MissingNo: ${missingNoMons.length}/${nonNpcMons.length}</p>
        </section><hr>`;

          // -------------------- TYPING STATS --------------------
          const baseMons = statsPool.filter(hasValidId);
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

          const typeOrder = typesData.map(type => type.name);
          const sortedTypes = Object.keys(typeMap).sort((a, b) => {
            const aRank = typeOrder.indexOf(a);
            const bRank = typeOrder.indexOf(b);
            if (aRank !== -1 && bRank !== -1 && aRank !== bRank) return aRank - bRank;
            if (aRank !== -1) return -1;
            if (bRank !== -1) return 1;
            return a.localeCompare(b);
          });

          let typeHtml = `<section class="stats-section">
            <h2>Typing Stats (${escapeHtml(statsModeLabel)})</h2>
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
          const value = typeof t === "string" ? t : (t?.value || t?.name);
          if (!label) return;
          const row = document.createElement("label");
          row.className = "opt";
          row.innerHTML = `<input type="checkbox" value="${escapeHtml(value)}"> <span>${escapeHtml(label)}</span>`;
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
      setupToggle(versionToggle, versionPanel);
      setupToggle(databaseTabToggle, databaseTabPanel);
      setupToggle(biomeToggle, biomePanel);
      setupToggle(subBiomeToggle, subBiomePanel);
      setupToggle(foundToggle, foundPanel);
      setupToggle(statusToggle, statusPanel);
      setupToggle(stageToggle, stagePanel);

      function rebuildEvolutionStageIndexes() {
        evolutionStageIndexes = new Map();
        const baseAndGonerMates = [
          ...((allData.evolution || {}).base || []),
          ...((allData.evolution || {}).goner || [])
        ];
        const baseAndGonerIndex = buildEvolutionStageIndex(baseAndGonerMates);
        evolutionStageIndexes.set("base", baseAndGonerIndex);
        evolutionStageIndexes.set("goner", baseAndGonerIndex);
        Object.entries(allData.evolution || {}).forEach(([mode, mates]) => {
          if (mode === "base" || mode === "goner") return;
          evolutionStageIndexes.set(mode, buildEvolutionStageIndex(mates));
        });
      }

      function getStageFilterValue() {
        const checked = stageOptionsEl.querySelector('input[name="stageFilter"]:checked');
        return checked ? checked.value : "all";
      }

      function getEvolutionStageInfo(mate) {
        let mode = mate?.mode || currentMode;
        if (mode === "event") mode = mate?.sourceMode || "base";
        if (mode === "goner" || mode === "database") mode = mate?.sourceMode || mate?.__mode || "base";
        const index = evolutionStageIndexes.get(mode) || evolutionStageIndexes.get("base");
        const name = String(mate?.name || "").trim();
        return index?.get(name) || {
          stages: new Set([1]),
          positions: new Set(["1/1"]),
          first: true,
          middle: false,
          final: true
        };
      }

      function stagePassesFilter(mate) {
        const filter = getStageFilterValue();
        if (filter === "all") return true;
        const info = getEvolutionStageInfo(mate);
        if (filter.startsWith("stage-")) return info.stages.has(Number(filter.slice(6)));
        return Boolean(info[filter]);
      }

      function getStatusFilterValue() {
        const checked = statusOptionsEl.querySelector('input[name="statusFilter"]:checked');
        return checked ? checked.value : "all";
      }

      function statusPassesFilter(mate) {
        const filter = getStatusFilterValue();
        if (filter === "all") return true;

        const mateWithMode = { ...mate, mode: mate.mode || currentMode };
        if (mateWithMode.mode === "npc") {
          if (filter === "missingno" || filter === "conceptualized" || filter === "nonfinalized") {
            return isNpcPlaceholder(mateWithMode);
          }
          if (filter === "designed" || filter === "finalized") {
            return isNpcCreated(mateWithMode);
          }
          return true;
        }

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
      clearVersions.addEventListener("click", () => {
        clearCheckboxes(versionOptionsEl);
        renderAnimatrix();
      });
      clearDatabaseTabs.addEventListener("click", () => {
        clearCheckboxes(databaseTabOptionsEl);
        loadMode(currentMode);
      });
      clearBiomes.addEventListener("click", () => {
        clearCheckboxes(biomeOptionsEl);
        clearCheckboxes(subBiomeOptionsEl);
        updateSubBiomeFilterVisibility();
        renderAnimatrix();
      });
      clearSubBiomes.addEventListener("click", () => {
        clearCheckboxes(subBiomeOptionsEl);
        renderAnimatrix();
      });
      clearFound.addEventListener("click", () => {
        clearCheckboxes(foundOptionsEl);
        renderAnimatrix();
      });

      // Wire checkbox changes to re-render
      typeOptionsEl.addEventListener("change", renderAnimatrix);
      type2OptionsEl.addEventListener("change", renderAnimatrix);
      paraOptionsEl.addEventListener("change", renderAnimatrix);
      versionOptionsEl.addEventListener("change", renderAnimatrix);
      databaseTabOptionsEl.addEventListener("change", () => loadMode(currentMode));
      biomeOptionsEl.addEventListener("change", () => {
        updateSubBiomeFilterVisibility();
        renderAnimatrix();
      });
      subBiomeOptionsEl.addEventListener("change", renderAnimatrix);
      foundOptionsEl.addEventListener("change", renderAnimatrix);
      statusOptionsEl.addEventListener("change", renderAnimatrix);
      stageOptionsEl.addEventListener("change", renderAnimatrix);

      // Mode switching
      modeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          listCostumeMode = false;
          modeButtons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          loadMode(btn.dataset.mode);
          updateListModeActions();
        });
      });

      function hasUsableId(mate) {
        return getMateDisplayId(mate) !== null;
      }

      function getVersionRank(mate) {
        const value = getMateVersions(mate)[0] || "";
        const idx = versionOptions.indexOf(normalizeVersionLabel(value));
        if (idx >= 0) return idx;
        const sortValue = getVersionSortValue(value);
        return Number.isFinite(sortValue) ? sortValue : 999;
      }

      function getAppearanceRank(mate) {
        const value = mate?.firstScannableUpdate || getMateVersions(mate)[0] || "";
        const sortValue = getVersionSortValue(value);
        return Number.isFinite(sortValue) ? sortValue : 999;
      }

      function getEventKey(mate) {
        const eventKey = String(mate?.event || "").trim().toLowerCase();
        if (eventKey === "april fools") return "fools";
        return eventKey;
      }

      function getEventRank(mate) {
        return eventOrder[getEventKey(mate)] ?? 999;
      }

      function compareByDisplayOrder(a, b) {
        const aMode = a.mode || a.__mode || "";
        const bMode = b.mode || b.__mode || "";
        if (aMode === "event" && bMode === "event") {
          const aEventRank = getEventRank(a);
          const bEventRank = getEventRank(b);
          if (aEventRank !== bEventRank) return aEventRank - bEventRank;

          const aOrder = Number(a.__order);
          const bOrder = Number(b.__order);
          const aHasOrder = Number.isInteger(aOrder);
          const bHasOrder = Number.isInteger(bOrder);
          if (aHasOrder && bHasOrder && aOrder !== bOrder) return aOrder - bOrder;
          if (aHasOrder !== bHasOrder) return aHasOrder ? -1 : 1;
        }

        const aId = getMateDisplayId(a);
        const bId = getMateDisplayId(b);
        const aHasId = aId !== null;
        const bHasId = bId !== null;
        if (aHasId && bHasId) {
          const aSortId = aId > 0 ? aId : Number.MAX_SAFE_INTEGER + Math.abs(aId);
          const bSortId = bId > 0 ? bId : Number.MAX_SAFE_INTEGER + Math.abs(bId);
          if (aSortId !== bSortId) return aSortId - bSortId;
          if (aId !== bId) return bId - aId;
        } else if (aHasId !== bHasId) {
          return aHasId ? -1 : 1;
        }

        const aVersionRank = getVersionRank(a);
        const bVersionRank = getVersionRank(b);
        if (aVersionRank !== bVersionRank) return aVersionRank - bVersionRank;

        const aRank = databaseModeRank[aMode] ?? 999;
        const bRank = databaseModeRank[bMode] ?? 999;
        if (aRank !== bRank) return aRank - bRank;

        if (aMode === "npc" && bMode === "npc") {
          const aOrder = Number(a.__order);
          const bOrder = Number(b.__order);
          const aHasOrder = Number.isInteger(aOrder);
          const bHasOrder = Number.isInteger(bOrder);
          if (aHasOrder && bHasOrder && aOrder !== bOrder) return aOrder - bOrder;
          if (aHasOrder !== bHasOrder) return aHasOrder ? -1 : 1;
        }

        return String(a.name || "").localeCompare(String(b.name || ""));
      }

      function compareByAppearanceOrder(a, b) {
        const aRank = getAppearanceRank(a);
        const bRank = getAppearanceRank(b);
        if (aRank !== bRank) return aRank - bRank;
        return compareByDisplayOrder(a, b);
      }

      function compareByCurrentSortMode(a, b) {
        if (sortMode === "appearance") return compareByAppearanceOrder(a, b);
        return compareByDisplayOrder(a, b);
      }

      function getDatabaseMates() {
        const selectedModes = getCheckedValues(databaseTabOptionsEl);
        const modesToShow = selectedModes.length
          ? databaseModes.filter(mode => selectedModes.includes(mode))
          : databaseModes;

        return modesToShow.flatMap(mode =>
          (allData[mode] || [])
            .filter(mate => !(mode === "event" && mate.sourceMode === "ncanon"))
            .map(mate => ({ ...mate, mode }))
        );
      }

      function getMateRef(mate) {
        const explicitRef = String(mate?.ref || "").trim();
        if (explicitRef) return explicitRef;
        return String(mate?.name || "").trim();
      }

      function getNpcFamilyKey(mate) {
        return String(mate?.id || "").trim();
      }

      function getAlternateGroupKey(mate) {
        if ((mate?.mode || currentMode) === "npc") {
          return `npc:${getNpcFamilyKey(mate)}`;
        }
        return `ref:${getResolvedMateRef(mate)}`;
      }

      function getReferenceKey(mate) {
        return String(mate?.name || "").trim();
      }

      function getModeRank(mode) {
        return databaseModeRank[mode] ?? 999;
      }

      function chooseReferencedMate(candidates, requesterMode = "") {
        if (!Array.isArray(candidates) || !candidates.length) return null;
        const preferred = candidates
          .slice()
          .sort((a, b) => {
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
          if (mode === "evolution") return;
          (mates || []).forEach(mate => {
            const form = { ...mate, mode };
            const ownName = getReferenceKey(form);
            if (ownName) {
              if (!mateByName.has(ownName)) {
                mateByName.set(ownName, []);
              }
              mateByName.get(ownName).push(form);
            }
          });
        });

        mateByName.forEach(forms => {
          forms.sort((a, b) => getModeRank(a.mode) - getModeRank(b.mode));
        });

        Object.entries(allData).forEach(([mode, mates]) => {
          if (mode === "evolution") return;
          (mates || []).forEach(mate => {
            const form = { ...mate, mode };
            const resolvedRef = getResolvedMateRef(form);
            if (!resolvedRef) return;
            if (!crossTabFormsByRef.has(resolvedRef)) {
              crossTabFormsByRef.set(resolvedRef, []);
            }
            crossTabFormsByRef.get(resolvedRef).push(form);
          });
        });
      }

      function getMateDisplayId(mate) {
        if (isMode(mate)) return null;

        const mode = mate?.mode || mate?.__mode || "";
        const order = Number(mate?.__idOrder ?? mate?.__order);

        if (mode === "base" && Number.isInteger(order)) {
          return order + 1;
        }

        if (mode === "ncanon") {
          return null;
        }

        if (mode === "goner" && Number.isInteger(order)) {
          if (mate?.__hasConfiguredIdOrder) return order + 1;
          return -(order + 1);
        }

        const resolvedMate = resolveReferenceRoot(mate);
        if (!resolvedMate || resolvedMate === mate) return null;
        return getMateDisplayId(resolvedMate);
      }

      function modeSupportsBiomes(mode) {
        return mode !== "npc" && mode !== "database" && mode !== "costumes";
      }

      function modeUsesBiomeArt(mode) {
        return mode !== "npc" && mode !== "database" && mode !== "costumes";
      }

      function setNpcControlVisibility(mode) {
        const isNpcMode = mode === "npc";
        [typeFilterWrapper, type2FilterWrapper, paraFilterWrapper, stageFilterWrapper].forEach(wrapper => {
          if (wrapper) wrapper.style.display = isNpcMode ? "none" : "inline-block";
        });
        if (foundFilterWrapper) foundFilterWrapper.style.display = isNpcMode ? "inline-block" : "none";
        if (statusFilterWrapper) statusFilterWrapper.style.display = "inline-block";
        if (!isNpcMode) {
          foundPanel.classList.remove("open");
          foundPanel.setAttribute("aria-hidden", "true");
        }
      }

      function setBiomeFilterVisibility(mode) {
        const showBiomes = modeSupportsBiomes(mode);
        if (biomeFilterWrapper) biomeFilterWrapper.style.display = showBiomes ? "inline-block" : "none";
        if (biomeToggle) biomeToggle.textContent = "Biome ▾";
        populateFilterOptions(biomeOptions, biomeOptionsEl);
        updateSubBiomeFilterVisibility();
        if (!showBiomes) {
          biomePanel.classList.remove("open");
          biomePanel.setAttribute("aria-hidden", "true");
          if (subBiomeFilterWrapper) subBiomeFilterWrapper.style.display = "none";
          if (subBiomePanel) {
            subBiomePanel.classList.remove("open");
            subBiomePanel.setAttribute("aria-hidden", "true");
          }
        }
      }

      function updateSubBiomeFilterVisibility() {
        if (!subBiomeFilterWrapper || !subBiomeOptionsEl) return;
        const selectedBiomes = modeSupportsBiomes(currentMode) ? getCheckedValues(biomeOptionsEl) : [];
        const subBiomes = selectedBiomes
          .flatMap(biome => Array.isArray(subBiomeOptionsByBiome[biome]) ? subBiomeOptionsByBiome[biome] : [])
          .filter(Boolean);
        const uniqueSubBiomes = Array.from(new Set(subBiomes));
        const selectedSubBiomes = new Set(getCheckedValues(subBiomeOptionsEl));
        populateFilterOptions(uniqueSubBiomes, subBiomeOptionsEl);
        subBiomeOptionsEl.querySelectorAll('input[type="checkbox"]').forEach(input => {
          input.checked = selectedSubBiomes.has(input.value);
        });
        const hasSubBiomes = uniqueSubBiomes.length > 0;
        subBiomeFilterWrapper.style.display = hasSubBiomes ? "inline-block" : "none";
        if (!hasSubBiomes) {
          subBiomePanel.classList.remove("open");
          subBiomePanel.setAttribute("aria-hidden", "true");
        }
      }

      function setDatabaseTabFilterVisibility(mode) {
        const showTabs = mode === "database";
        if (databaseTabFilterWrapper) databaseTabFilterWrapper.style.display = showTabs ? "inline-block" : "none";
        if (!showTabs) {
          databaseTabPanel.classList.remove("open");
          databaseTabPanel.setAttribute("aria-hidden", "true");
        }
      }

      function getMateBiomes(mate, mode = currentMode) {
        if (!mate) return [];
        if (mode === "database") {
          return getMateVersions(mate);
        }
        if ((mate.mode || mode) === "costumes") return [];
        if (Array.isArray(mate.biomes)) return mate.biomes.filter(Boolean);
        if (Array.isArray(mate.biome)) return mate.biome.filter(Boolean);
        if (typeof mate.biome === "string" && mate.biome.trim()) return [mate.biome.trim()];
        if (typeof mate.Biome === "string" && mate.Biome.trim()) return [mate.Biome.trim()];
        const resolvedMate = resolveReferenceRoot(mate);
        if (resolvedMate && resolvedMate !== mate) {
          if (Array.isArray(resolvedMate.biomes)) return resolvedMate.biomes.filter(Boolean);
          if (Array.isArray(resolvedMate.biome)) return resolvedMate.biome.filter(Boolean);
          if (typeof resolvedMate.biome === "string" && resolvedMate.biome.trim()) return [resolvedMate.biome.trim()];
          if (typeof resolvedMate.Biome === "string" && resolvedMate.Biome.trim()) return [resolvedMate.Biome.trim()];
        }
        return [];
      }

      function getMateSubBiomes(mate) {
        if (!mate) return [];
        if (Array.isArray(mate.subBiomes)) return mate.subBiomes.filter(Boolean);
        if (Array.isArray(mate.subBiome)) return mate.subBiome.filter(Boolean);
        if (typeof mate.subBiome === "string" && mate.subBiome.trim()) return [mate.subBiome.trim()];
        const resolvedMate = resolveReferenceRoot(mate);
        if (resolvedMate && resolvedMate !== mate) {
          if (Array.isArray(resolvedMate.subBiomes)) return resolvedMate.subBiomes.filter(Boolean);
          if (Array.isArray(resolvedMate.subBiome)) return resolvedMate.subBiome.filter(Boolean);
          if (typeof resolvedMate.subBiome === "string" && resolvedMate.subBiome.trim()) return [resolvedMate.subBiome.trim()];
        }
        return [];
      }

      function getNpcFoundLocations(mate) {
        if (!mate) return ["Unspecified"];
        const value = mate.found ?? mate.Found ?? mate.areas ?? mate.area;
        if (Array.isArray(value)) {
          const locations = value.map(location => String(location || "").trim()).filter(Boolean);
          return locations.length ? locations : ["Unspecified"];
        }
        if (typeof value === "string" && value.trim()) return [value.trim()];
        return ["Unspecified"];
      }

      function getNpcFoundOptions() {
        return Array.from(new Set((allData.npc || []).flatMap(getNpcFoundLocations)))
          .sort((a, b) => a.localeCompare(b));
      }

      function biomesPassFilter(mateBiomes, selectedBiomes) {
        if (!Array.isArray(selectedBiomes) || !selectedBiomes.length) return true;
        const biomes = Array.isArray(mateBiomes) ? mateBiomes.filter(Boolean) : [];
        return selectedBiomes.some(b => biomes.includes(b));
      }

      function subBiomesPassFilter(mateSubBiomes, selectedSubBiomes) {
        if (!Array.isArray(selectedSubBiomes) || !selectedSubBiomes.length) return true;
        const subBiomes = Array.isArray(mateSubBiomes) ? mateSubBiomes.filter(Boolean) : [];
        return selectedSubBiomes.some(subBiome => subBiomes.includes(subBiome));
      }

      function foundPassesFilter(mate, selectedFound) {
        if (!Array.isArray(selectedFound) || !selectedFound.length) return true;
        const locations = getNpcFoundLocations(mate);
        return selectedFound.some(location => locations.includes(location));
      }

      function versionsPassFilter(mate, selectedVersions) {
        if (!Array.isArray(selectedVersions) || !selectedVersions.length) return true;
        const versions = getMateVersions(mate);
        return selectedVersions.some(version => versions.includes(version));
      }

      function updateAnimatrixSubtitle(selectedVersions = getCheckedValues(versionOptionsEl)) {
        if (!animatrixSubtitle) return;
        if (!Array.isArray(selectedVersions) || selectedVersions.length !== 1) {
          animatrixSubtitle.textContent = "";
          animatrixSubtitle.hidden = true;
          return;
        }
        const version = normalizeVersionLabel(selectedVersions[0]);
        const info = versionInfoByName.get(version);
        animatrixSubtitle.textContent = info?.title || version;
        animatrixSubtitle.hidden = false;
      }

      function cssImageUrl(path) {
        return `url("${String(path || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"')}")`;
      }

      function loadMode(mode) {
        currentMode = mode;
        setNpcControlVisibility(mode);
        setBiomeFilterVisibility(mode);
        setDatabaseTabFilterVisibility(mode);
        const listSidebarMode = isListViewActive() && !listCostumeMode && mode !== "database" && mode !== "npc"
          ? "base"
          : mode;
        const sourceData = isRightClickSearchActive()
          ? getDatabaseMates()
          : listSidebarMode === "database"
          ? getDatabaseMates()
          : (listCostumeMode && listSidebarMode === "costumes")
            ? getRelatedCostumes(listCostumeSourceMate || currentDetailMate)
          : (Array.isArray(allData[listSidebarMode]) ? allData[listSidebarMode].map(mate => ({ ...mate, mode: listSidebarMode })) : []);
        animatrixData = sourceData
          .filter(mate => !isMode(mate))
          .sort(compareByCurrentSortMode);
        renderAnimatrix();
      }

      function renderAnimatrix() {
        animatrix.innerHTML = "";
        updateListModeActions();
        const listViewActive = isListViewActive();
        const term = (search.value || "").trim().toLowerCase();
        const selectedTypes = getCheckedValues(typeOptionsEl);
        const selectedTypes2 = getCheckedValues(type2OptionsEl);
        const selectedParas = getCheckedValues(paraOptionsEl);
        const selectedVersions = getCheckedValues(versionOptionsEl);
        const selectedBiomes = modeSupportsBiomes(currentMode) ? getCheckedValues(biomeOptionsEl) : [];
        const selectedSubBiomes = modeSupportsBiomes(currentMode) ? getCheckedValues(subBiomeOptionsEl) : [];
        const selectedFound = currentMode === "npc" ? getCheckedValues(foundOptionsEl) : [];
        updateAnimatrixSubtitle(selectedVersions);

        const intersects = (a, b) => Array.isArray(a) && Array.isArray(b) && a.some(x => b.includes(x));
        const filteredMates = animatrixData
          .filter(mate => {
            if (!mate) return false;
            if (isMode(mate)) return false;
            if (!mateMatchesSearch(mate, term)) return false;
            if (selectedTypes.length) {
              if (!mate.types || !intersects(selectedTypes, mate.types)) return false;
            }
            if (selectedTypes2.length) {
              if (!mate.types || !intersects(selectedTypes2, mate.types)) return false;
            }
            if (selectedParas.length) {
              if (!mate.paraTypes || !intersects(selectedParas, mate.paraTypes)) return false;
            }
            if (!versionsPassFilter(mate, selectedVersions)) return false;
            if (modeSupportsBiomes(currentMode)) {
              const mateBiomes = getMateBiomes(mate);
              if (!biomesPassFilter(mateBiomes, selectedBiomes)) return false;
              const mateSubBiomes = getMateSubBiomes(mate);
              if (!subBiomesPassFilter(mateSubBiomes, selectedSubBiomes)) return false;
            }
            if (currentMode === "npc" && !foundPassesFilter(mate, selectedFound)) return false;
            if (!statusPassesFilter(mate)) return false;
            if (!stagePassesFilter(mate)) return false;
            if (currentMode === "npc" && mate.cosmark === "Y") return false;
            return true;
          });

        if (term) {
          searchResultCount.textContent = `${filteredMates.length} ${filteredMates.length === 1 ? "result" : "results"}`;
          searchResultCount.hidden = false;
        } else {
          searchResultCount.textContent = "";
          searchResultCount.hidden = true;
        }

        if (!filteredMates.length) {
          const empty = document.createElement("div");
          empty.className = "cat-empty";
          empty.textContent = listCostumeMode ? "No costumes for this animate." : "No matching animates.";
          animatrix.appendChild(empty);
          return;
        }

        filteredMates.forEach(mate => {
            const card = document.createElement("div");
            card.className = "card";
            card.__mate = mate;
            const listViewCard = isListViewActive();
            if (listViewCard) card.classList.add("list-card");
            if (listViewCard && currentDetailMate && sameMateForList(mate, currentDetailMate)) {
              card.classList.add("selected");
            }
            if (!listViewCard && isParagon(mate)) card.classList.add("rarity-paragon");
            const firstBiome = getMateBiomes(mate)[0];
            const biomeImage = getBiomeImagePath(firstBiome, getMateSubBiomes(mate)[0]);
            if (!listViewCard && biomeImage && modeUsesBiomeArt(currentMode)) {
              card.classList.add("biome-bg");
              card.style.setProperty("--biome-image", cssImageUrl(biomeImage));
            }
            if (!listViewCard) {
              applyMateStyle(card, mate);
            }

            const lostImage = mate.image && mate.image.toLowerCase().includes("assets/images/mates/lost");
            const displayName = escapeHtml(mate.name) + (lostImage ? "*" : "");
            const displayId = getMateDisplayId(mate);
            const showId = !shouldHideMateId(mate);
            const idText = listViewCard ? formatListCardId(mate) : (displayId === null ? "?" : String(displayId));
            const shiverBadge = isShiver(mate)
              ? `<img class="rarity-shiver-badge" src="assets/images/ui/Shiver.png" alt="Shiver" title="Shiver">`
              : "";

            if (listViewCard) {
              const rowLabel = document.createElement("span");
              rowLabel.className = "list-card-label";
              rowLabel.textContent = currentMode === "costumes" || !showId
                ? (mate.name || "")
                : `${idText} - ${mate.name || ""}${lostImage ? "*" : ""}`;
              card.appendChild(rowLabel);
            } else {
              // Inner HTML for the card
              card.innerHTML = `
                ${showId ? `<div class="card-id">${escapeHtml(idText)}</div>` : ""}
                ${shiverBadge}
                <img src="${escapeHtml(mate.image || '')}" alt="${escapeHtml(mate.name)}">
                <h3>${displayName}</h3>
                ${(mate.event === "fools") ? "" : `
                  <div class="types">${(mate.types || []).map(t => typeTag(t)).join("")}</div>
                  ${(mate.paraTypes || []).length ? `<div class="types">${mate.paraTypes.map(p => typeTag(p)).join("")}</div>` : ""} 
                `}
              `;
            }

            card.addEventListener("click", () => openDetails(mate));
            card.addEventListener("contextmenu", event => {
              event.preventDefault();
              showVariationsById(mate);
            });
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

      function getMateEvolutionPool(mate) {
        const mode = mate?.mode || currentMode;
        const evolutionModes = mode === "base" || mode === "goner"
          ? ["base", "goner"]
          : [mode];
        const pools = [
          getMateModePool(mate),
          ...evolutionModes.map(evolutionMode =>
            ((allData.evolution || {})[evolutionMode] || []).map(m => ({ ...m, mode: m.mode || evolutionMode }))
          )
        ];
        const seen = new Set();
        return pools.flat().filter(entry => {
          const key = [entry.name || "", entry.ref || "", entry.image || "", entry.mode || ""].join("\u0000");
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }

      function sameMateForList(a, b) {
        if (!a || !b) return false;
        if ((a.mode || currentMode) === "costumes" || (b.mode || currentMode) === "costumes") {
          return (a.name || "") === (b.name || "") && getMateRef(a) === getMateRef(b);
        }
        return getResolvedMateRef(a) === getResolvedMateRef(b);
      }

      function updateListSelectionClasses() {
        if (!isListViewActive()) return;
        animatrix.querySelectorAll(".card.list-card").forEach(card => {
          card.classList.toggle("selected", sameMateForList(card.__mate, currentDetailMate));
        });
      }

      function typeTag(typeName) {
        const t = typesData.find(x => x.name === typeName);
        return `<span style="background:${t ? t.color : '#ccc'}">${escapeHtml(typeName)}</span>`;
      }

      function mateVitalsHtml(mate) {
        if ((mate.mode || currentMode) === "costumes") return "";
        const biomes = getMateBiomes(mate);
        const subBiomes = getMateSubBiomes(mate);
        const biomeText = biomes.length ? biomes.map(b => escapeHtml(b)).join(", ") : "Unknown";
        const subBiomeHtml = subBiomes.length ? `<p><b>Sub-Biomes:</b> ${subBiomes.map(b => escapeHtml(b)).join(", ")}</p>` : "";
        const height = escapeHtml(mate.height || "Unknown");
        const color = escapeHtml(mate.color || "Unknown");
        const etymology = mate.etymology ? `<p><b>Etymology:</b> ${escapeHtml(mate.etymology)}</p>` : "";
        const firstScannable = mate.firstScannableUpdate
          ? `<p><b>First Scannable Update:</b> ${escapeHtml(mate.firstScannableUpdate)}</p>`
          : "";
        const firstWildCatchable = mate.firstWildCatchableUpdate
          ? `<p><b>First Wild-Capturable Update:</b> ${escapeHtml(mate.firstWildCatchableUpdate)}</p>`
          : "";
        const visualDescription = mate.visualDescription
          ? `<p><b>Visual Description:</b> ${escapeHtml(mate.visualDescription)}</p>`
          : "";
        const paragonOf = isParagon(mate) ? getParagonOf(mate) : "";
        const paragonHtml = paragonOf ? `<p><b>Paragon of:</b> ${escapeHtml(paragonOf)}</p>` : "";
        const locationLabel = currentMode === "database" ? "Versions" : "Biomes";
        return `<div class="mate-meta"><p><b>${locationLabel}:</b> ${biomeText}</p>${subBiomeHtml}<p><b>Height:</b> ${height}</p><p><b>Color:</b> ${color}</p>${etymology}${firstScannable}${firstWildCatchable}${visualDescription}${paragonHtml}</div>`;
      }

      function asArray(value) {
        if (Array.isArray(value)) return value;
        if (value === null || value === undefined || value === "") return [];
        return [value];
      }

      function normalizeObtainmentItems(mate) {
        const raw = mate?.obtainment;

        if (Array.isArray(raw)) return raw;
        if (raw && typeof raw === "object") return [raw];
        if (typeof raw === "string" && raw.trim()) return [raw.trim()];

        if (typeof mate?.quest === "string" && mate.quest.trim()) {
          return [{ quest: { "quest desc": mate.quest.trim() } }];
        }

        return [];
      }

      function renderObtainmentHtml(mate) {
        const items = normalizeObtainmentItems(mate);
        if (!items.length) return `<b>Obtainment:</b><div>None</div>`;

        const blocks = [];

        items.forEach(item => {
          if (typeof item === "string") {
            blocks.push(`<div>${escapeHtml(item)}</div>`);
            return;
          }

          if (!item || typeof item !== "object") return;

          if (item.quest !== undefined) {
            asArray(item.quest).forEach(quest => {
              if (typeof quest === "string") {
                blocks.push(`<div><strong>Quest:</strong> ${escapeHtml(quest)}</div>`);
                return;
              }

              if (!quest || typeof quest !== "object") return;

              const questName = quest["quest-name"] || quest.questName || quest.name || "";
              const questDesc = quest["quest desc"] || quest.questDesc || quest.description || quest.desc || "";
              const parts = [];
              if (questName) parts.push(`<div><strong>Quest:</strong> ${escapeHtml(questName)}</div>`);
              if (questDesc) parts.push(`<div>${escapeHtml(questDesc)}</div>`);
              if (!parts.length) parts.push(`<div><strong>Quest:</strong> None</div>`);
              blocks.push(parts.join(""));
            });
          }

          if (item.shop !== undefined) {
            asArray(item.shop).forEach(shop => {
              if (typeof shop === "string") {
                blocks.push(`<div><strong>Shop:</strong> ${escapeHtml(shop)}</div>`);
                return;
              }

              if (!shop || typeof shop !== "object") return;

              const shopkeeper = shop.shopkeeper || shop["shopkeeper:"] || shop.keeper || "";
              const cost = shop.cost || "";
              const shopDesc = shop["shop-desc"] || shop.shopDesc || shop.description || shop.desc || "";
              const parts = [`<div><strong>Shop:</strong> ${escapeHtml(shopkeeper || "Unknown")}</div>`];
              if (cost) parts.push(`<div><strong>Cost:</strong> ${escapeHtml(cost)}</div>`);
              if (shopDesc) parts.push(`<div>${escapeHtml(shopDesc)}</div>`);
              blocks.push(parts.join(""));
            });
          }
        });

        if (!blocks.length) return `<b>Obtainment:</b><div>None</div>`;
        return `<b>Obtainment:</b>${blocks.map(block => `<div style="margin-top:6px;">${block}</div>`).join("")}`;
      }

      gridView.addEventListener("click", () => {
        listCostumeMode = false;
        gridView.classList.add("active");
        listView.classList.remove("active");
        animatrix.className = "grid";
        document.body.classList.remove("animatrix-list-view");
        updateListModeActions();
        renderAnimatrix();
      });
      listView.addEventListener("click", () => {
        listView.classList.add("active");
        gridView.classList.remove("active");
        animatrix.className = "list";
        document.body.classList.add("animatrix-list-view");
        listCostumeMode = false;
        listCostumeSourceMate = null;
        loadMode("base");
        setMainModeButton("base");
      });

      function setSortMode(nextSortMode) {
        sortMode = nextSortMode === "appearance" ? "appearance" : "id";
        if (idSortView) idSortView.classList.toggle("active", sortMode === "id");
        if (appearanceSortView) appearanceSortView.classList.toggle("active", sortMode === "appearance");
        animatrixData.sort(compareByCurrentSortMode);
        renderAnimatrix();
      }

      idSortView.addEventListener("click", () => setSortMode("id"));
      appearanceSortView.addEventListener("click", () => setSortMode("appearance"));

      search.addEventListener("input", () => {
        if (!isRightClickSearchActive()) {
          rightClickSearchId = "";
          loadMode(currentMode);
          return;
        }
        renderAnimatrix();
      });


      const randomMateBtn = document.getElementById("randomMateBtn");

      randomMateBtn.addEventListener("click", () => {
        if (!animatrixData || animatrixData.length === 0) return;

        // Rebuild the currently visible list using the same filters
        const term = (search.value || "").trim().toLowerCase();
        const selectedTypes = getCheckedValues(typeOptionsEl);
        const selectedTypes2 = getCheckedValues(type2OptionsEl);
        const selectedParas = getCheckedValues(paraOptionsEl);
        const selectedVersions = getCheckedValues(versionOptionsEl);
        const selectedBiomes = modeSupportsBiomes(currentMode) ? getCheckedValues(biomeOptionsEl) : [];
        const selectedSubBiomes = modeSupportsBiomes(currentMode) ? getCheckedValues(subBiomeOptionsEl) : [];
        const selectedFound = currentMode === "npc" ? getCheckedValues(foundOptionsEl) : [];
        

        const intersects = (a, b) =>
          Array.isArray(a) && Array.isArray(b) && a.some(x => b.includes(x));

        const visibleMates = animatrixData.filter(mate => {
          if (!mate) return false;
          if (isMode(mate)) return false;
          if (!mateMatchesSearch(mate, term)) return false;
          if (selectedTypes.length) {
            if (!mate.types || !intersects(selectedTypes, mate.types)) return false;
          }
          if (selectedTypes2.length) {
            if (!mate.types || !intersects(selectedTypes2, mate.types)) return false;
          }
          if (selectedParas.length) {
            if (!mate.paraTypes || !intersects(selectedParas, mate.paraTypes)) return false;
          }
          if (!versionsPassFilter(mate, selectedVersions)) return false;
          if (modeSupportsBiomes(currentMode)) {
            const mateBiomes = getMateBiomes(mate);
            if (!biomesPassFilter(mateBiomes, selectedBiomes)) return false;
            const mateSubBiomes = getMateSubBiomes(mate);
            if (!subBiomesPassFilter(mateSubBiomes, selectedSubBiomes)) return false;
          }
          if (currentMode === "npc" && !foundPassesFilter(mate, selectedFound)) return false;
          if (!statusPassesFilter(mate)) return false;
          if (!stagePassesFilter(mate)) return false;
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
        if (isListViewActive() && mateMode !== "costumes") {
          setMainModeButton("base");
        } else if (currentMode !== "database") {
          activateModeButton(mateMode);
        }

        // set currentMateIndex to the index within the current filtered animatrixData, if present
        const idx = animatrixData.findIndex(m =>
          m.name === mate.name &&
          getResolvedMateRef(m) === getResolvedMateRef(mate) &&
          (m.mode || currentMode) === (mate.mode || mateMode)
        );
        currentMateIndex = idx >= 0 ? idx : 0;

        updateDetails(mate);
        updateListSelectionClasses();
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
        el.classList.remove("event-anti");
        el.classList.remove("event-fools");

        // event styles
        const eventKey = getEventKey(mate);
        if (eventKey === "halloween") {
          el.style.backgroundColor = "#4B0082";
          el.style.color = "#ff6c1c";
        } 
        else if (eventKey === "winter") {
          el.style.backgroundColor = "#001f4d";
          el.style.color = "#cce6ff";
        } 
        else if (eventKey === "fools") {
          el.style.backgroundColor = "#fff";
          el.style.color = "#000";
          el.style.fontFamily = "Arial, sans-serif";
          el.classList.add("event-fools");
        }
        else if (eventKey === "anti") {
          el.classList.add("event-anti");
        }

        // primary type border
        const primaryType = mate.types?.[0];
        const typeObj = typesData.find(t => t.name === primaryType);
        const outlineColor = typeObj ? typeObj.color : "#ccc";
        el.style.setProperty("--outline-color", outlineColor);
        el.style.border = `3px solid ${outlineColor}`;
      }


      function updateDetails(mate) {
        currentDetailMate = mate;
        updateListModeActions();
        const modalContent =
        document.querySelector("#detailsModal .modal-content") ||
        document.getElementById("detailsModal");
        const mateImage = document.getElementById("mateImage");
        applyMateStyle(modalContent, mate);
        setModeBadge(mate.mode || currentMode, mate);
        document.getElementById("mateName").textContent = mate.name || "";
        mateImage.src = mate.image || "";
        mateImage.onclick = null;
        mateImage.removeAttribute("title");
        if ((mate.name || "").toLowerCase() === "blarb") {
          mateImage.title = "Open UPROD";
          mateImage.onclick = () => {
            if (window.uproNavigate?.("/credtrix")) return;
            const basePath = window.location.pathname.toLowerCase().startsWith("/upro/")
              ? "/UPRO"
              : "";
            window.location.href = `${basePath}/credtrix`;
          };
        }
        document.getElementById("mateVitals").innerHTML = mateVitalsHtml(mate);
        const mateVitals = document.getElementById("mateVitals");
        const detailBiome = getMateBiomes(mate)[0];
        const detailBiomeImage = getBiomeImagePath(detailBiome, getMateSubBiomes(mate)[0]);
        mateVitals.classList.toggle("biome-bg", Boolean(detailBiomeImage));
        if (detailBiomeImage) {
          mateVitals.style.setProperty("--biome-image", cssImageUrl(detailBiomeImage));
        } else {
          mateVitals.style.removeProperty("--biome-image");
        }

        // Types (hide for NPCs)
        document.getElementById("mateTypes").innerHTML = currentMode !== "npc" && currentMode !== "costumes"
          ? (mate.types || []).map(t => typeTag(t)).join("")
          : "";

        // Tabs
        const tabsContainer = document.querySelector(".dex-tabs");
        tabsContainer.innerHTML = "";

        if (currentMode === "npc") {
          document.getElementById("abilityContainer").innerHTML = mate.cosmark === "Y"
            ? renderObtainmentHtml(mate)
            : "";
          document.getElementById("paraTypesContainer").innerHTML = "";
          document.getElementById("evolutionsContainer").innerHTML = "";
          const npcHtml = `
              <div><strong>Friendskip Message: </strong>${escapeHtml(mate.Description || "None")}</div>
              <div><strong>Reference:</strong> ${escapeHtml(mate.reference || "None")}</div>
            `;
          document.getElementById("mateDexText").innerHTML = npcHtml;

          if (mate.cosmark !== "Y") {
            const fullHeart = "\u2665";
            const emptyHeart = "\u2661";
            const npcEntryNames = [
              `${fullHeart}${emptyHeart}${emptyHeart}${emptyHeart}`,
              `${fullHeart}${fullHeart}${emptyHeart}${emptyHeart}`,
              `${fullHeart}${fullHeart}${fullHeart}${emptyHeart}`,
              `${fullHeart}${fullHeart}${fullHeart}${fullHeart}`
            ];
            const renderNpcEntry = entryName => {
              const entryText = mate.dexEntries?.[entryName] || mate.entries?.[entryName] || mate[entryName];
              return entryText ? escapeHtml(entryText) : npcHtml;
            };
            const setNpcEntry = activeIndex => {
              tabsContainer.querySelectorAll(".dex-tab").forEach((tab, index) => {
                tab.classList.toggle("active", index === activeIndex);
                tab.textContent = index <= activeIndex ? fullHeart : emptyHeart;
              });
              document.getElementById("mateDexText").innerHTML = renderNpcEntry(npcEntryNames[activeIndex]);
            };

            npcEntryNames.forEach((name, idx) => {
              const tabBtn = document.createElement("button");
              tabBtn.className = "dex-tab";
              tabBtn.dataset.entry = name;
              tabBtn.setAttribute("aria-label", name);
              tabBtn.onclick = () => setNpcEntry(idx);
              tabsContainer.appendChild(tabBtn);
            });

            setNpcEntry(0);
          }
        }
        else {
          let tabNames = ["Discovered", "First Caught", "Experienced", "Callside"];
          if (currentMode === "costumes") tabNames = ["Store", "Catalog", "Callside"];

          tabNames.forEach((name, idx) => {
            const tabBtn = document.createElement("button");
            tabBtn.className = "dex-tab";
            if (idx === 0) tabBtn.classList.add("active");
            tabBtn.dataset.entry = name;
            tabBtn.textContent = name;

            tabBtn.onclick = () => {
              document.querySelectorAll(".dex-tab").forEach(t => t.classList.remove("active"));
              tabBtn.classList.add("active");

              let text;
              if (currentMode === "costumes") {
                if (name === "Store") text = mate.store || "No entry yet.";
                else if (name === "Catalog") text = mate.catalog || mate.description || "No entry yet.";
                else text = mate.callside || mate.reverense || "No entry yet";
              } else {
                const legacyEntry = name === "Callside" ? mate.dexEntries?.Reverense : null;
                text = mate.dexEntries ? (mate.dexEntries[name] || legacyEntry || mate.description) : mate.description;
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
          } else if (currentMode === "costumes") {
            abilityContainer.innerHTML = renderObtainmentHtml(mate);
          }

          const listTypesContainer = document.getElementById("listTypesContainer");
          if (listTypesContainer) {
            listTypesContainer.innerHTML = isListViewActive() && currentMode !== "npc" && currentMode !== "costumes"
              ? `<b>Types:</b> ${(mate.types || []).map(t => typeTag(t)).join("")}`
              : "";
          }

          // Para types
          const paraContainer = document.getElementById("paraTypesContainer");
          paraContainer.innerHTML = mate.paraTypes ? `<b>Para Types:</b> ${mate.paraTypes.map(p => typeTag(p)).join("")}` : "";

          // Evolution line (previous + current + next, same mode)
          const evoC = document.getElementById("evolutionsContainer");
          evoC.innerHTML = "";
          if (currentMode !== "costumes") {
            const mateMode = mate.mode || currentMode;
            const modeForms = getMateEvolutionPool(mate);
            const byName = new Map(modeForms.map(m => [m.name, m]));
            if (!byName.has(mate.name)) byName.set(mate.name, mate);

            const outgoing = new Map();
            const incoming = new Map();
            modeForms.forEach(m => {
              (m.evolvesTo || []).forEach(e => {
                if (!e || !e.name) return;
                if (!outgoing.has(m.name)) outgoing.set(m.name, []);
                outgoing.get(m.name).push({
                  to: e.name,
                  level: e.level,
                  item: e.Item,
                  info: e.info || e.customInfo
                });

                if (!incoming.has(e.name)) incoming.set(e.name, []);
                incoming.get(e.name).push({
                  from: m.name,
                  level: e.level,
                  item: e.Item,
                  info: e.info || e.customInfo
                });
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
                  requirements.push({ level: edge.level, item: edge.item, info: edge.info });
                  seen.add(edge.to);
                  dfs(edge.to, names, requirements, seen);
                  seen.delete(edge.to);
                  names.pop();
                  requirements.pop();
                });
                if (!progressed) {
                  paths.push({ names: [...names], requirements: [...requirements] });
                }
              }
              dfs(rootName, [rootName], [], new Set([rootName]));
              return paths;
            }

            function evolutionRequirementText(requirement) {
              if (!requirement) return "";
              const parts = [];
              if (requirement.level !== null && requirement.level !== undefined && requirement.level !== "") {
                parts.push(`Lvl ${requirement.level}`);
              }
              if (requirement.item !== null && requirement.item !== undefined && String(requirement.item).trim()) {
                parts.push(`Item: ${requirement.item}`);
              }
              if (requirement.info !== null && requirement.info !== undefined && String(requirement.info).trim()) {
                parts.push(String(requirement.info).trim());
              }
              return parts.join(" | ");
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
                    lvl.textContent = evolutionRequirementText(line.requirements[idx]);
                    link.appendChild(arrow);
                    link.appendChild(lvl);
                    lineEl.appendChild(link);
                  }
                });

                evoC.appendChild(lineEl);
              });
            }
          }
        }

        const sacredC = document.getElementById("sacredContainer");
        const ModeC = document.getElementById("ModeContainer");
        sacredC.innerHTML = "";
        ModeC.innerHTML = "";
        if (isListViewActive()) {
          return;
        }
        const mateMode = mate.mode || currentMode;
        const modeForms = getMateModePool(mate);

        // Modes: same tab + same id, Mode entries only
        {
          const alternateGroupKey = getAlternateGroupKey(mate);
          const sameSpeciesSameMode = modeForms.filter(f => getAlternateGroupKey(f) === alternateGroupKey);
          const modeOnlyForms = sameSpeciesSameMode.filter(f => {
            if (f.name === mate.name && f.image === mate.image) return false;
            if (mateMode === "npc") return true;
            if (isMode(mate)) return true;
            return isMode(f);
          });

          if (modeOnlyForms.length) {
            ModeC.innerHTML = "<b>Modes:</b><br>";
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

        // Alternate Forms: same ref across tabs, excluding ncanon and Mode entries
        {
          const mateRef = getResolvedMateRef(mate);
          const sameSpeciesAllTabs = crossTabFormsByRef.get(mateRef) || [];
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


    return () => {
      document.body.classList.remove("animatrix-page", "animatrix-list-view")
      window.onload = null
    }
  }, [])

  return (
    <>
      {pageStyles && <style>{pageStyles}</style>}
      <div className="upro-page-root"><header className="animatrix-header">
    <button
      id="searchHelpButton"
      className="search-help-button"
      type="button"
      title="Search help"
      aria-label="Show search help"
      aria-expanded="false"
      aria-controls="searchHelpModal"
    >i</button>
    <div style={{display: 'flex'}}>
      <div id="nav-btn">
        <a href="/">
          <button>Main Menu</button>
        </a>
      </div>
      <a href="/catalog">
        <button>Categories</button>
      </a>
      <a href="/vote">
        <button>Vote</button>
      </a>
      <button id="statsBtn">Stats</button>
      <button id="randomMateBtn" title="Random Mate">Random</button>
    </div>
    <h1>The Animatrix</h1>
    <p id="animatrixSubtitle" hidden />
    <div className="controls">
      <input type="text" id="search" placeholder="Search..." />
      {/* Custom checkbox-dropdown for Types */}
      <div className="multi-filter" id="typeFilterWrapper">
        <button className="filter-toggle" id="typeToggle">Types ▾</button>
        <div className="filter-panel" id="typePanel" aria-hidden="true">
          <div className="panel-actions">
            <button id="clearTypes" className="clear-btn">Clear</button>
          </div>
          <div className="options" id="typeOptions" />
        </div>
      </div>
      {/* Secondary Type parameter */}
      <div className="multi-filter" id="type2FilterWrapper">
        <button className="filter-toggle" id="type2Toggle">Other Types ▾</button>
        <div className="filter-panel" id="type2Panel" aria-hidden="true">
          <div className="panel-actions">
            <button id="clearTypes2" className="clear-btn">Clear</button>
          </div>
          <div className="options" id="type2Options" />
        </div>
      </div>
      {/* Custom checkbox-dropdown for Para Types */}
      <div className="multi-filter" id="paraFilterWrapper">
        <button className="filter-toggle" id="paraToggle">Para Types ▾</button>
        <div className="filter-panel" id="paraPanel" aria-hidden="true">
          <div className="panel-actions">
            <button id="clearParas" className="clear-btn">Clear</button>
          </div>
          <div className="options" id="paraOptions" />
        </div>
      </div>
      {/* Version filters */}
      <div className="multi-filter" id="versionFilterWrapper">
        <button className="filter-toggle" id="versionToggle">Versions ▾</button>
        <div className="filter-panel" id="versionPanel" aria-hidden="true">
          <div className="panel-actions">
            <button id="clearVersions" className="clear-btn">Clear</button>
          </div>
          <div className="options" id="versionOptions" />
        </div>
      </div>
      {/* Database source tab filters */}
      <div className="multi-filter" id="databaseTabFilterWrapper" style={{display: 'none'}}>
        <button className="filter-toggle" id="databaseTabToggle">Tabs ▾</button>
        <div className="filter-panel" id="databaseTabPanel" aria-hidden="true">
          <div className="panel-actions">
            <button id="clearDatabaseTabs" className="clear-btn">Clear</button>
          </div>
          <div className="options" id="databaseTabOptions" />
        </div>
      </div>
      {/* Base/Event biome filters */}
      <div className="multi-filter" id="biomeFilterWrapper">
        <button className="filter-toggle" id="biomeToggle">Biome ▾</button>
        <div className="filter-panel" id="biomePanel" aria-hidden="true">
          <div className="panel-actions">
            <button id="clearBiomes" className="clear-btn">Clear</button>
          </div>
          <div className="options" id="biomeOptions" />
        </div>
      </div>
      <div className="multi-filter" id="subBiomeFilterWrapper" style={{display: 'none'}}>
        <button className="filter-toggle" id="subBiomeToggle">Sub-Biome ▾</button>
        <div className="filter-panel" id="subBiomePanel" aria-hidden="true">
          <div className="panel-actions">
            <button id="clearSubBiomes" className="clear-btn">Clear</button>
          </div>
          <div className="options" id="subBiomeOptions" />
        </div>
      </div>
      <div className="multi-filter" id="foundFilterWrapper" style={{display: 'none'}}>
        <button className="filter-toggle" id="foundToggle">Found ▾</button>
        <div className="filter-panel" id="foundPanel" aria-hidden="true">
          <div className="panel-actions">
            <button id="clearFound" className="clear-btn">Clear</button>
          </div>
          <div className="options" id="foundOptions" />
        </div>
      </div>
      {/* Status filter */}
      <div className="multi-filter" id="statusFilterWrapper">
        <button className="filter-toggle" id="statusToggle">Status ▾</button>
        <div className="filter-panel" id="statusPanel" aria-hidden="true">
          <div className="options" id="statusOptions">
            <label className="opt">
              <input type="radio" name="statusFilter" defaultValue="all" defaultChecked />
              <span>All</span>
            </label>
            <label className="opt">
              <input type="radio" name="statusFilter" defaultValue="missingno" />
              <span>MissingNos</span>
            </label>
            <label className="opt">
              <input type="radio" name="statusFilter" defaultValue="designed" />
              <span>Designed</span>
            </label>
            <label className="opt">
              <input type="radio" name="statusFilter" defaultValue="nonfinalized" />
              <span>Non-Finalized</span>
            </label>
            <label className="opt">
              <input type="radio" name="statusFilter" defaultValue="conceptualized" />
              <span>Conceptualized</span>
            </label>
            <label className="opt">
              <input type="radio" name="statusFilter" defaultValue="finalized" />
              <span>Finalized</span>
            </label>
          </div>
        </div>
      </div>
      <div className="multi-filter" id="stageFilterWrapper">
        <button className="filter-toggle" id="stageToggle">Stage ▾</button>
        <div className="filter-panel" id="stagePanel" aria-hidden="true">
          <div className="options" id="stageOptions">
            <label className="opt">
              <input type="radio" name="stageFilter" defaultValue="all" defaultChecked />
              <span>All Stages</span>
            </label>
            <label className="opt">
              <input type="radio" name="stageFilter" defaultValue="stage-1" />
              <span>Stage 1</span>
            </label>
            <label className="opt">
              <input type="radio" name="stageFilter" defaultValue="stage-2" />
              <span>Stage 2</span>
            </label>
            <label className="opt">
              <input type="radio" name="stageFilter" defaultValue="stage-3" />
              <span>Stage 3</span>
            </label>
            <label className="opt">
              <input type="radio" name="stageFilter" defaultValue="first" />
              <span>First Stage</span>
            </label>
            <label className="opt">
              <input type="radio" name="stageFilter" defaultValue="middle" />
              <span>Middle Stage</span>
            </label>
            <label className="opt">
              <input type="radio" name="stageFilter" defaultValue="final" />
              <span>Final Stage</span>
            </label>
          </div>
        </div>
      </div>
      <div className="view-toggle">
        <button id="gridView" className="active">Grid</button>
        <button id="listView">List</button>
      </div>
      <div className="view-toggle">
        <button id="appearanceSortView">Appearance</button>
        <button id="idSortView" className="active">ID</button>
      </div>
      <div className="mode-switch" id="modeSwitch">
        <button className="mode-btn active" data-mode="base">Base</button>
        <button className="mode-btn" data-mode="sacred">Sacred</button>
        <button className="mode-btn" data-mode="ace">Ace</button>
        <button className="mode-btn" data-mode="ncanon">Non-Canon</button>
        <button className="mode-btn" data-mode="goner">Goner</button>
        <button className="mode-btn" data-mode="event">Event</button>
        <button className="mode-btn" data-mode="costumes">Costumes</button>
        <button className="mode-btn" data-mode="database">Database</button>
        <button className="mode-btn" data-mode="npc">NPCs</button>
      </div>
    </div>
  </header>
  <div id="listModeActions" className="list-mode-actions" hidden />
  <p id="searchResultCount" className="search-result-count" role="status" aria-live="polite" hidden />
  <main id="animatrix" className="grid" />
  <div id="searchHelpModal" className="modal hidden">
    <div className="modal-content search-help-content">
      <button id="closeSearchHelp" className="close-btn" aria-label="Close search guide">✕</button>
      <div className="modal-header">
        <h2>Search Guide</h2>
      </div>
      <div className="modal-body search-help-body">
        <dl>
          <div><dt>Names</dt><dd>Enter a full or partial name, like <code>Lemody</code> or <code>lem</code>.</dd></div>
          <div><dt>IDs</dt><dd>Enter an exact ID, like <code>42</code> or <code>-3</code>.</dd></div>
          <div><dt>Stage</dt><dd>Use <code>1*</code>, <code>2*</code>, or <code>3*</code>.</dd></div>
          <div><dt>Line Position</dt><dd>Use <code>1/2</code>, <code>2/2</code>, <code>1/3</code>, <code>2/3</code>, or <code>3/3</code>.</dd></div>
          <div><dt>Single Line</dt><dd>Use <code>1/1</code>.</dd></div>
          <div><dt>Right Click</dt><dd>Right-click an animate card to search for every variation that shares its Animatrix ID.</dd></div>
        </dl>
      </div>
    </div>
  </div>
  {/* Details Modal */}
  <div id="detailsModal" className="modal hidden">
    <div className="modal-content">
      <button id="closeModal" className="close-btn">✕</button>
      <div className="modal-header">
        <h2 id="mateName" />
        <div className="types" id="mateTypes" />
        <div id="modeBadge" className="mode-badge" />
      </div>
      <div className="modal-body">
        <div className="image-container">
          <img id="mateImage" alt="" />
        </div>
        <div className="dex-tabs">
          <button className="dex-tab active" data-entry="Discovered">Discovered</button>
          <button className="dex-tab" data-entry="First Caught">First Caught</button>
          <button className="dex-tab" data-entry="Experienced">Experienced</button>
          <button className="dex-tab" data-entry="Callside">Callside</button>
        </div>
        <p id="mateDexText" />
        <div id="mateVitals" className="mate-vitals" />
        <div id="abilityContainer" />
        <div id="listTypesContainer" />
        <div id="paraTypesContainer" />
        <div id="evolutionsContainer" />
        <div id="ModeContainer" />
        <div id="sacredContainer" />
      </div>
      <div className="modal-footer">
        <button id="prevMate" className="nav-btn">← Previous</button>
        <button id="nextMate" className="nav-btn">Next →</button>
      </div>
    </div>
  </div>
  <div id="statsModal" className="modal hidden">
    <div className="modal-content">
      <button id="closeStats" className="close-btn">✕</button>
      <h2>Animatrix Statistics</h2>
      <div id="statsContent" />
    </div>
  </div></div>
    </>
  )
}
