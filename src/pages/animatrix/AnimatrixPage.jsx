/* eslint-disable no-unused-vars */
import { useEffect } from 'react'

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

      const animatrix = document.getElementById("animatrix");
      const gridView = document.getElementById("gridView");
      const listView = document.getElementById("listView");
      const listModeActions = document.getElementById("listModeActions");
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
      const statusToggle = document.getElementById("statusToggle");
      const statusPanel = document.getElementById("statusPanel");
      const statusOptionsEl = document.getElementById("statusOptions");

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
      const biomeOptions = [
        "Lake",
        "Forest",
        "Desert",
        "River",
        "Mountains",
        "Plains",
        "Circus",
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

      function annotateMateOrder(mode, mates) {
        let idOrder = 0;
        (mates || []).forEach((mate, index) => {
          mate.__mode = mode;
          mate.__order = index;
          mate.__idOrder = isMode(mate) ? null : idOrder++;
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
        if (Array.isArray(mate.versions)) return mate.versions.filter(Boolean).map(v => String(v).trim()).filter(Boolean);
        if (typeof mate.versions === "string" && mate.versions.trim()) return [mate.versions.trim()];
        if (Array.isArray(mate.version)) return mate.version.filter(Boolean).map(v => String(v).trim()).filter(Boolean);
        if (typeof mate.version === "string" && mate.version.trim()) return [mate.version.trim()];
        if (typeof mate.Version === "string" && mate.Version.trim()) return [mate.Version.trim()];
        return [];
      }

      function compareVersionLabels(a, b) {
        const aLabel = String(a || "").trim();
        const bLabel = String(b || "").trim();
        const aMatch = aLabel.match(/^Demo\s+(\d+)$/i);
        const bMatch = bLabel.match(/^Demo\s+(\d+)$/i);

        if (aMatch && bMatch) {
          return Number(aMatch[1]) - Number(bMatch[1]);
        }
        if (aMatch) return -1;
        if (bMatch) return 1;
        return aLabel.localeCompare(bLabel);
      }

      function rebuildVersionOptions() {
        const labels = new Set();
        ["base", "sacred", "ace", "goner", "event", "costumes", "npc"].forEach(mode => {
          (allData[mode] || []).forEach(mate => {
            getMateVersions(mate).forEach(version => labels.add(version));
          });
        });
        versionOptions = Array.from(labels).sort(compareVersionLabels);
      }

      // mode buttons
      const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));

      function isListViewActive() {
        return document.body.classList.contains("animatrix-list-view");
      }

      function formatListCardId(mate) {
        const displayId = getMateDisplayId(mate);
        if (displayId === null) return "????";
        const sign = displayId < 0 ? "-" : "";
        return `${sign}${String(Math.abs(displayId)).padStart(4, "0")}`;
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

      // Load types first
      fetch("data/types.json")
        .then(res => res.json())
        .then(types => {
          typesData = types || [];
          populateFilterOptions(typesData, typeOptionsEl);
          populateFilterOptions(typesData, type2OptionsEl);
          populateFilterOptions(typesData, paraOptionsEl);
          populateFilterOptions(databaseModes.map(mode => ({ name: databaseModeLabels[mode], value: mode })), databaseTabOptionsEl);
          populateFilterOptions(biomeOptions, biomeOptionsEl);

          // load abilities and all mode JSONs
          return Promise.all([
            fetch("data/abilities.json").then(r => r.json()).catch(() => []),
            fetch("data/mates/base.json").then(r => r.json()).catch(() => []),
            fetch("data/mates/sacred.json").then(r => r.json()).catch(() => []),
            fetch("data/mates/ace.json").then(r => r.json()).catch(() => []),
            fetch("data/mates/goner.json").then(r => r.json()).catch(() => []),
            fetch("data/mates/ncanon.json").then(r => r.json()).catch(() => []),
            fetch("data/mates/costumes.json").then(r => r.json()).catch(() => []),
            fetch("data/mates/npc.json").then(r => r.json()).catch(() => []),
          ]);
        })
        .then(([abilities, base, sacred, ace, goner, ncanon, costumes, npc]) => {
            abilitiesData = abilities || [];
            allData = { 
              base: annotateMateOrder("base", base || []), 
              sacred: annotateMateOrder("sacred", sacred || []), 
              ace: annotateMateOrder("ace", ace || []), 
              goner: annotateMateOrder("goner", goner || []),
              ncanon: annotateMateOrder("ncanon", ncanon || []), 
              costumes: annotateMateOrder("costumes", costumes || []),
              npc: annotateMateOrder("npc", npc || []),
              event: [] // initialize event
            };

            // now safe to filter and push to event
            Object.entries(allData).forEach(([mode, mates]) => {
              if (mode === "event") return; // skip event itself
              allData[mode] = mates.filter(mate => {
                if (mode === "base" && mate.event !== undefined && mate.event !== null) {
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
            rebuildVersionOptions();
            populateFilterOptions(versionOptions, versionOptionsEl);

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
          const hasValidId = m => getMateDisplayId(m) !== null;
          const allMons = Object.entries(allData).flatMap(
            ([mode, mons]) => mons.map(m => ({ ...m, mode }))
          );

          // -------------------- MODE STATS --------------------
          const modeList = ["base", "sacred", "ace", "goner", "ncanon", "event", "costumes", "npc"];
          let modeHtml = `<section class="stats-section">
            <h2>Mode Stats</h2>
            <div class="mode-stats">`;

            modeList.forEach(mode => {
              const mons = (allData[mode] || []).map(m => ({ ...m, mode }));
              let createdCount;
              let finalizedCount;
              let totalCount;

              if (mode === "npc") {
                const npcMons = mons.filter(m => usesNimage(m));
                createdCount = npcMons.filter(isNpcCreated).length;
                totalCount = npcMons.length;
              } else {
                const statsMons = mons.filter(hasValidId);
                totalCount = statsMons.length;
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
        const highestId = allMons
          .map(m => getMateDisplayId(m))
          .filter(id => Number.isFinite(id))
          .reduce((max, id) => Math.max(max, id), Number.NEGATIVE_INFINITY);
        const missingNoHtml = `<section class="stats-section">
          <p>Current Highest ID: ${Number.isFinite(highestId) ? highestId : "None"}</p>
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
        renderAnimatrix();
      });

      // Wire checkbox changes to re-render
      typeOptionsEl.addEventListener("change", renderAnimatrix);
      type2OptionsEl.addEventListener("change", renderAnimatrix);
      paraOptionsEl.addEventListener("change", renderAnimatrix);
      versionOptionsEl.addEventListener("change", renderAnimatrix);
      databaseTabOptionsEl.addEventListener("change", () => loadMode(currentMode));
      biomeOptionsEl.addEventListener("change", renderAnimatrix);
      statusOptionsEl.addEventListener("change", renderAnimatrix);

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
        const idx = versionOptions.indexOf(String(value).trim());
        return idx >= 0 ? idx : 999;
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
          const aSortableId = Math.abs(aId);
          const bSortableId = Math.abs(bId);
          if (aSortableId !== bSortableId) return aSortableId - bSortableId;
          if (aId !== bId) return aId - bId;
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
          return -1;
        }

        if (mode === "goner" && Number.isInteger(order)) {
          return -order;
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

      function setBiomeFilterVisibility(mode) {
        const showBiomes = modeSupportsBiomes(mode);
        if (biomeFilterWrapper) biomeFilterWrapper.style.display = showBiomes ? "inline-block" : "none";
        if (biomeToggle) biomeToggle.textContent = "Biome ▾";
        populateFilterOptions(biomeOptions, biomeOptionsEl);
        if (!showBiomes) {
          biomePanel.classList.remove("open");
          biomePanel.setAttribute("aria-hidden", "true");
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

      function biomesPassFilter(mateBiomes, selectedBiomes) {
        if (!Array.isArray(selectedBiomes) || !selectedBiomes.length) return true;
        const biomes = Array.isArray(mateBiomes) ? mateBiomes.filter(Boolean) : [];
        return selectedBiomes.some(b => biomes.includes(b));
      }

      function versionsPassFilter(mate, selectedVersions) {
        if (!Array.isArray(selectedVersions) || !selectedVersions.length) return true;
        const versions = getMateVersions(mate);
        return selectedVersions.some(version => versions.includes(version));
      }

      function biomeImagePath(biomeName) {
        if (!biomeName) return "";
        return `assets/images/ui/biomes/${encodeURIComponent(String(biomeName).trim())}.png`;
      }

      function loadMode(mode) {
        currentMode = mode;
        setBiomeFilterVisibility(mode);
        setDatabaseTabFilterVisibility(mode);
        const listSidebarMode = isListViewActive() && !listCostumeMode && mode !== "database" && mode !== "npc"
          ? "base"
          : mode;
        const sourceData = listSidebarMode === "database"
          ? getDatabaseMates()
          : (listCostumeMode && listSidebarMode === "costumes")
            ? getRelatedCostumes(listCostumeSourceMate || currentDetailMate)
          : (Array.isArray(allData[listSidebarMode]) ? allData[listSidebarMode].map(mate => ({ ...mate, mode: listSidebarMode })) : []);
        animatrixData = sourceData
          .filter(mate => !isMode(mate))
          .sort(compareByDisplayOrder);
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

        const intersects = (a, b) => Array.isArray(a) && Array.isArray(b) && a.some(x => b.includes(x));
        const filteredMates = animatrixData
          .filter(mate => {
            if (!mate) return false;
            if (isMode(mate)) return false;
            if (listViewActive) return true;
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
            if (!versionsPassFilter(mate, selectedVersions)) return false;
            if (modeSupportsBiomes(currentMode)) {
              const mateBiomes = getMateBiomes(mate);
              if (!biomesPassFilter(mateBiomes, selectedBiomes)) return false;
            }
            if (!statusPassesFilter(mate)) return false;
            if (currentMode === "npc" && mate.cosmark === "Y") return false;
            return true;
          });

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
            if (!listViewCard && firstBiome && modeUsesBiomeArt(currentMode)) {
              card.classList.add("biome-bg");
              card.style.setProperty("--biome-image", `url('${biomeImagePath(firstBiome)}')`);
            }
            if (!listViewCard) {
              applyMateStyle(card, mate);
            }

            const lostImage = mate.image && mate.image.toLowerCase().includes("assets/images/mates/lost");
            const displayName = escapeHtml(mate.name) + (lostImage ? "*" : "");
            const displayId = getMateDisplayId(mate);
            const idText = listViewCard ? formatListCardId(mate) : (displayId === null ? "?" : String(displayId));
            const shiverBadge = isShiver(mate)
              ? `<img class="rarity-shiver-badge" src="assets/images/ui/Shiver.png" alt="Shiver" title="Shiver">`
              : "";

            if (listViewCard) {
              const rowLabel = document.createElement("span");
              rowLabel.className = "list-card-label";
              rowLabel.textContent = currentMode === "costumes"
                ? (mate.name || "")
                : `${idText} - ${mate.name || ""}${lostImage ? "*" : ""}`;
              card.appendChild(rowLabel);
            } else {
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
            }

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
        const biomeText = biomes.length ? biomes.map(b => escapeHtml(b)).join(", ") : "Unknown";
        const height = escapeHtml(mate.height || "Unknown");
        const color = escapeHtml(mate.color || "Unknown");
        const paragonOf = isParagon(mate) ? getParagonOf(mate) : "";
        const paragonHtml = paragonOf ? `<p><b>Paragon of:</b> ${escapeHtml(paragonOf)}</p>` : "";
        const locationLabel = currentMode === "database" ? "Versions" : "Biomes";
        return `<div class="mate-meta"><p><b>${locationLabel}:</b> ${biomeText}</p><p><b>Height:</b> ${height}</p><p><b>Color:</b> ${color}</p>${paragonHtml}</div>`;
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

      search.addEventListener("input", renderAnimatrix);


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
          if (!versionsPassFilter(mate, selectedVersions)) return false;
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
        if ((mate.name || "").toLowerCase() === "thoot") {
          mateImage.title = "Open UPROD";
          mateImage.onclick = () => {
            window.location.href = "/credtrix";
          };
        }
        document.getElementById("mateVitals").innerHTML = mateVitalsHtml(mate);
        const mateVitals = document.getElementById("mateVitals");
        const detailBiome = getMateBiomes(mate)[0];
        mateVitals.classList.toggle("biome-bg", Boolean(detailBiome));
        if (detailBiome) {
          mateVitals.style.setProperty("--biome-image", `url('${biomeImagePath(detailBiome)}')`);
        } else {
          mateVitals.style.removeProperty("--biome-image");
        }

        // Types (hide for NPCs)
        document.getElementById("mateTypes").innerHTML = currentMode !== "npc"
          ? (mate.types || []).map(t => typeTag(t)).join("")
          : "";

        // Tabs
        const tabsContainer = document.querySelector(".dex-tabs");
        tabsContainer.innerHTML = "";

        if (currentMode === "npc") {
          document.getElementById("abilityContainer").innerHTML = renderObtainmentHtml(mate);
          document.getElementById("paraTypesContainer").innerHTML = "";
          document.getElementById("evolutionsContainer").innerHTML = "";
          const tabsContainer = document.querySelector(".dex-tabs");
          tabsContainer.innerHTML = "";
          const npcHtml = `
              <div><strong>Description: </strong>${escapeHtml(mate.Description || "None")}</div>
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

              let text;
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
          } else if (currentMode === "costumes") {
            abilityContainer.innerHTML = renderObtainmentHtml(mate);
          }

          const listTypesContainer = document.getElementById("listTypesContainer");
          if (listTypesContainer) {
            listTypesContainer.innerHTML = isListViewActive() && currentMode !== "npc"
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
            const modeForms = getMateModePool(mate);
            const byName = new Map(modeForms.map(m => [m.name, m]));
            if (!byName.has(mate.name)) byName.set(mate.name, mate);

            const outgoing = new Map();
            const incoming = new Map();
            modeForms.forEach(m => {
              (m.evolvesTo || []).forEach(e => {
                if (!e || !e.name) return;
                if (!outgoing.has(m.name)) outgoing.set(m.name, []);
                outgoing.get(m.name).push({ to: e.name, level: e.level, item: e.Item });

                if (!incoming.has(e.name)) incoming.set(e.name, []);
                incoming.get(e.name).push({ from: m.name, level: e.level, item: e.Item });
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
                  requirements.push({ level: edge.level, item: edge.item });
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

        // Alternate Forms: same ref across tabs, excluding ncanon and Mode entries
        const sacredC = document.getElementById("sacredContainer");
        sacredC.innerHTML = "";
        if (isListViewActive()) {
          document.getElementById("ModeContainer").innerHTML = "";
          return;
        }
        const mateMode = mate.mode || currentMode;
        const modeForms = getMateModePool(mate);
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

        // Alternates: same tab + same id, Mode entries only
        const ModeC = document.getElementById("ModeContainer");
        ModeC.innerHTML = "";
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


    return () => {
      document.body.classList.remove("animatrix-page", "animatrix-list-view")
      window.onload = null
    }
  }, [])

  return (
    <>
      {pageStyles && <style>{pageStyles}</style>}
      <div className="upro-page-root"><header>
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
      <div className="view-toggle">
        <button id="gridView" className="active">Grid</button>
        <button id="listView">List</button>
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
  <main id="animatrix" className="grid" />
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
          <img id="mateImage" alt />
        </div>
        <div className="dex-tabs">
          <button className="dex-tab active" data-entry="Discovered">Discovered</button>
          <button className="dex-tab" data-entry="First Caught">First Caught</button>
          <button className="dex-tab" data-entry="Experienced">Experienced</button>
          <button className="dex-tab" data-entry="Reverence">Reverence</button>
        </div>
        <p id="mateDexText" />
        <div id="mateVitals" className="mate-vitals" />
        <div id="abilityContainer" />
        <div id="listTypesContainer" />
        <div id="paraTypesContainer" />
        <div id="evolutionsContainer" />
        <div id="sacredContainer" />
        <div id="ModeContainer" />
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
