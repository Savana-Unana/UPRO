import { mateSubBiomes } from '../../utils/biomeData.js'
import { useEffect } from 'react'
import { fetchMateBuckets } from '../../utils/mateData'

/* eslint-disable no-unused-vars, no-useless-assignment */
const pageStyles = `
  #categoryGroups { width: 100%; max-width: 1600px; margin-inline: auto; padding: clamp(16px, 3vw, 40px); }
  .cat-group-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(340px, 100%), 1fr)); gap: clamp(14px, 2vw, 24px); align-items: start; }
  .cat-group-cards > .cat-grouping-title { grid-column: 1 / -1; }
  .cat-group-cards > .cat-section { min-width: 0; margin: 0; padding: 0; border: 1px solid #00ffff60; border-radius: 12px; background: #222; overflow: hidden; }
  .cat-group-cards .cat-title { margin: 0; padding: 0; }
  .cat-group-cards > .cat-group-open { grid-column: 1 / -1; }
  .cat-group-toggle { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-content: start; gap: 12px 16px; width: 100%; min-height: 180px; margin: 0; border: 0; border-radius: 0; background: transparent; text-align: left; cursor: pointer; padding: clamp(20px, 2vw, 28px); font-size: clamp(26px, 2vw, 32px); line-height: 1.25; white-space: normal; overflow-wrap: anywhere; }
  .cat-group-toggle:hover { background: #ffffff08; }
  .cat-group-toggle:focus-visible { outline: 2px solid #0ff; outline-offset: -4px; }
  .cat-group-name { align-self: center; }
  .cat-group-count { font-size: 22px; border: 1px solid #00ffff50; border-radius: 8px; padding: 4px 10px; align-self: start; }
  .cat-group-hint { grid-column: 1 / -1; display: block; font-size: clamp(20px, 1.5vw, 24px); line-height: 1.4; font-weight: normal; }
  .cat-group-preview { grid-column: 1 / -1; display: flex; justify-content: center; align-items: center; margin-top: 8px; padding-top: 16px; border-top: 1px solid #ffffff18; }
  .cat-group-preview img { width: clamp(140px, 12vw, 190px); height: clamp(140px, 12vw, 190px); max-width: 100%; object-fit: contain; }
  .cat-group-cards .cat-group-contents:not([hidden]) { padding: 20px; border-top: 1px solid #ffffff20; }
  .cat-grid { grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr)); }
  .cat-grid .card { max-width: 100%; min-width: 0; }
  @media (max-width: 480px) {
    .cat-group-cards .cat-group-contents:not([hidden]) { padding: 12px; }
    .cat-group-toggle { min-height: 150px; }
  }
`
function runPageScript() {
  let allData = {};
  let typesData = [];
  let visibleMates = [];
  let currentMateIndex = 0;
  let groupsData = [];
  const expandedGroups = new Set();
  let idOrderRank = new Map();
  let crossTabFormsByRef = new Map();
  let mateByName = new Map();

  function normalizeOrderName(name) {
    return String(name || "").trim().replace(/\s*\([^)]*\)\s*$/g, "").toLowerCase();
  }

  function getIdOrder(mate) {
    for (const name of [mate.name, mate.ref, mate.__groupName]) {
      const rank = idOrderRank.get(normalizeOrderName(name));
      if (rank !== undefined) return rank;
    }
    return Number.MAX_SAFE_INTEGER;
  }

  function annotateMateOrder(mode, mates) {
    (mates || []).forEach((mate, index) => {
      mate.__mode = mode;
      mate.__order = index;
    });
    return mates || [];
  }

  function normalizeGroup(group) {
    if (!group || typeof group !== "object") {
      return {
        name: "Unnamed Group",
        type: "normal",
        description: "",
        animates: []
      };
    }

    const normalizedType = String(group.type || "normal").trim().toLowerCase() === "bonus"
      ? "bonus"
      : "normal";
    const star = String(group.Star || group.star || "").trim();

    return {
      ...group,
      name: group.name ? String(group.name) : "Unnamed Group",
      type: normalizedType,
      star,
      grouping: typeof group.grouping === "string" ? group.grouping.trim() : "",
      description: typeof group.description === "string" ? group.description.trim() : "",
      animates: [...new Set([...(Array.isArray(group.animates) ? group.animates : []), star].filter(Boolean))]
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    const groupsRoot = document.getElementById("categoryGroups");
    const search = document.getElementById("search");
    const groupView = document.getElementById("groupView");
    const modeBadge = document.getElementById("modeBadge");
    const modal = document.getElementById("detailsModal");
    const closeModal = document.getElementById("closeModal");
    const nextMate = document.getElementById("nextMate");
    const prevMate = document.getElementById("prevMate");

    const allowedRarities = new Set(["Normal", "Mode", "Shiver", "Paragon"]);
    function getRarities(mate) {
      const raw = mate?.rarity;
      let list = [];

      if (Array.isArray(raw)) list = raw;
      else if (typeof raw === "string") list = raw.split(/[,+|/]/g).map(x => x.trim()).filter(Boolean);
      else if (raw !== undefined && raw !== null) list = [String(raw).trim()];

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

    function getMateRef(mate) {
      const explicitRef = String(mate?.ref || "").trim();
      if (explicitRef) return explicitRef;
      return String(mate?.name || "").trim();
    }

    function getNpcFamilyKey(mate) {
      return String(mate?.id || "").trim();
    }

    function getAlternateGroupKey(mate) {
      if ((mate?.mode || "") === "npc") {
        return `npc:${getNpcFamilyKey(mate)}`;
      }
      return `ref:${getResolvedMateRef(mate)}`;
    }

    function getReferenceKey(mate) {
      return String(mate?.name || "").trim();
    }

    function getModeRank(mode) {
      const rank = { base: 0, sacred: 1, ace: 2, goner: 3, ncanon: 4, event: 5, costumes: 6, npc: 7 };
      return rank[mode] ?? 999;
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

    fetch("data/info.json")
      .then(r => r.json())
      .then(info => {
        typesData = Array.isArray(info?.typings) ? info.typings : [];
        return Promise.all([
          fetch("data/mates/groups.json").then(r => r.json()).catch(() => []),
          fetchMateBuckets(),
          fetch("data/mates/idorder.json").then(r => r.json()).catch(() => []),
        ]);
      })
      .then(([groups, mateBuckets, idOrder]) => {
        idOrderRank = new Map();
        (Array.isArray(idOrder) ? idOrder : []).forEach((name, index) => {
          const key = normalizeOrderName(name);
          if (key && !idOrderRank.has(key)) idOrderRank.set(key, index);
        });
        groupsData = Array.isArray(groups) ? groups.map(normalizeGroup) : [];
        allData = {
          base: annotateMateOrder("base", mateBuckets.base || []),
          sacred: annotateMateOrder("sacred", mateBuckets.sacred || []),
          ace: annotateMateOrder("ace", mateBuckets.ace || []),
          goner: annotateMateOrder("goner", mateBuckets.goner || []),
          ncanon: annotateMateOrder("ncanon", mateBuckets.ncanon || []),
          costumes: annotateMateOrder("costumes", mateBuckets.costumes || []),
          npc: annotateMateOrder("npc", mateBuckets.npc || []),
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
        renderGroups();
      })
      .catch(err => {
        console.error("Failed to load groups page data", err);
        groupsRoot.innerHTML = `<div class="cat-empty">Failed to load data.</div>`;
      });

    function renderGroups() {
      const term = (search.value || "").trim().toLowerCase();
      const allForms = Object.entries(allData).flatMap(([mode, mates]) => (mates || []).map(m => ({ ...m, mode })));
      groupsRoot.innerHTML = "";
      visibleMates = [];

      const normalGroups = groupsData.filter(group => group.type !== "bonus");
      const bonusGroups = groupsData.filter(group => group.type === "bonus");

      renderGroupSection(normalGroups, allForms, term, {
        heading: "Groups",
        emptyMessage: "No groups defined. Add entries to data/mates/groups.json."
      });

      renderGroupSection(bonusGroups, allForms, term, {
        heading: "Bonus Groups",
        emptyMessage: "No bonus groups defined yet.",
        isBonusSection: true
      });

      if (!groupsRoot.children.length) {
        groupsRoot.innerHTML = `<div class="cat-empty">No groups defined. Add entries to data/mates/groups.json.</div>`;
      }
    }

    function renderGroupSection(groups, allForms, term, options = {}) {
      if (!Array.isArray(groups) || !groups.length) return;

      const wrapper = document.createElement("section");
      wrapper.className = options.isBonusSection ? "cat-grouping cat-grouping-bonus" : "cat-grouping";
      const cardView = groupView.value === "cards";
      if (cardView) wrapper.classList.add("cat-group-cards");

      if (options.heading) {
        const heading = document.createElement("h2");
        heading.className = "cat-grouping-title";
        heading.textContent = options.heading;
        wrapper.appendChild(heading);
      }

      let renderedCount = 0;

      groups.forEach(group => {
        const groupName = group.name;
        const nameList = group.animates;

        const found = [];
        nameList.forEach(name => {
          const wanted = String(name || "").trim();
          allForms.forEach(mate => {
            if (String(mate.name || "").trim() === wanted) found.push(mate);
          });
        });

        const deduped = [];
        const seen = new Set();
        found.forEach(m => {
          const key = `${m.mode || ""}|${m.__order ?? ""}|${m.name || ""}|${m.image || ""}`;
          if (seen.has(key)) return;
          seen.add(key);
          deduped.push(m);
        });

        const filtered = deduped.filter(mate => {
          if (!mate) return false;
          if (isMode(mate)) return false;
          if (term && !(mate.name || "").toLowerCase().includes(term)
            && !(cardView && groupName.toLowerCase().includes(term))) return false;
          return true;
        });

        filtered.sort((a, b) => getIdOrder(a) - getIdOrder(b)
          || getModeRank(a.mode) - getModeRank(b.mode)
          || a.__order - b.__order);

        if (cardView && term && !filtered.length && !groupName.toLowerCase().includes(term)) return;

        const section = document.createElement("section");
        section.className = group.type === "bonus" ? "cat-section cat-section-bonus" : "cat-section";

        const title = document.createElement("h2");
        title.className = "cat-title";
        title.textContent = `${groupName} (${filtered.length})`;
        section.appendChild(title);

        const expanded = !cardView || expandedGroups.has(group);
        if (cardView) {
          section.classList.toggle("cat-group-open", expanded);
          const toggle = document.createElement("button");
          toggle.type = "button";
          toggle.id = `group-toggle-${groupsData.indexOf(group)}`;
          toggle.className = "cat-group-toggle";
          const name = document.createElement("span");
          name.className = "cat-group-name";
          name.textContent = groupName;
          const count = document.createElement("span");
          count.className = "cat-group-count";
          count.textContent = filtered.length;
          count.setAttribute("aria-label", `${filtered.length} Animates`);
          toggle.append(name, count);
          toggle.setAttribute("aria-expanded", String(expanded));
          const hint = document.createElement("span");
          hint.className = "cat-group-hint";
          hint.textContent = group.grouping || group.description;
          toggle.appendChild(hint);
          if (!expanded) {
            const preview = document.createElement("span");
            preview.className = "cat-group-preview";
            const star = deduped
              .filter(mate => mate.name === group.star && mate.image && !isMode(mate))
              .sort((a, b) => getModeRank(a.mode) - getModeRank(b.mode))[0];
            const image = document.createElement("img");
            image.src = star?.image || `${import.meta.env.BASE_URL}assets/images/mates/lost/MissingNo.png`;
            image.alt = star?.name || "MissingNo";
            image.loading = "lazy";
            preview.appendChild(image);
            toggle.appendChild(preview);
          }
          toggle.onclick = () => {
            if (expandedGroups.has(group)) expandedGroups.delete(group);
            else expandedGroups.add(group);
            renderGroups();
            document.getElementById(toggle.id)?.focus();
          };
          title.replaceChildren(toggle);
        }

        const contents = document.createElement("div");
        contents.className = "cat-group-contents";
        contents.hidden = !expanded;
        section.appendChild(contents);

        if (group.type === "bonus" && group.description) {
          const description = document.createElement("p");
          description.className = "cat-description";
          description.textContent = group.description;
          contents.appendChild(description);
        }

        if (!filtered.length) {
          const empty = document.createElement("div");
          empty.className = "cat-empty";
          empty.textContent = "No matching animates.";
          contents.appendChild(empty);
        } else {
          const grid = document.createElement("div");
          grid.className = "cat-grid";
          filtered.forEach(mate => {
            if (expanded) visibleMates.push(mate);
            grid.appendChild(makeCard(mate));
          });
          contents.appendChild(grid);
        }

        wrapper.appendChild(section);
        renderedCount += 1;
      });

      if (!renderedCount && options.emptyMessage) {
        const empty = document.createElement("div");
        empty.className = "cat-empty";
        empty.textContent = options.emptyMessage;
        wrapper.appendChild(empty);
      }

      groupsRoot.appendChild(wrapper);
    }

    function makeCard(mate) {
      const card = document.createElement("div");
      card.className = "card catalog-card";

      const lostImage = mate.image && mate.image.toLowerCase().includes("assets/images/mates/lost");
      const displayName = escapeHtml(mate.name) + (lostImage ? "*" : "");
      card.innerHTML = `
        <img src="${escapeHtml(mate.image || "")}" alt="${escapeHtml(mate.name || "")}">
        <h3>${displayName}</h3>
      `;
      return card;
    }

    function openDetails(mate) {
      const idx = visibleMates.findIndex(m => sameMate(m, mate));
      currentMateIndex = idx >= 0 ? idx : 0;
      updateDetails(mate);
      modal.classList.remove("hidden");
    }

    function updateDetails(mate) {
      const mateMode = mate.mode || "base";
      const modalContent =
        document.querySelector("#detailsModal .modal-content") ||
        document.getElementById("detailsModal");

      applyMateStyle(modalContent, mate);
      setModeBadge(mateMode, mate);

      document.getElementById("mateName").textContent = mate.name || "";
      document.getElementById("mateImage").src = mate.image || "";
      document.getElementById("mateTypes").innerHTML = mateMode !== "npc" && mateMode !== "costumes"
        ? (mate.types || []).map(t => typeTag(t)).join("")
        : "";
      document.getElementById("mateVitals").innerHTML = mateVitalsHtml(mate);

      const tabsContainer = document.querySelector(".dex-tabs");
      tabsContainer.innerHTML = "";

      if (mateMode === "npc") {
        document.getElementById("abilityContainer").innerHTML = renderObtainmentHtml(mate);
        document.getElementById("paraTypesContainer").innerHTML = "";
        document.getElementById("evolutionsContainer").innerHTML = "";
        const npcHtml = `
            <div><strong>Description: </strong>${escapeHtml(mate.Description || "None")}</div>
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
      } else {
        let tabNames = ["Discovered", "First Caught", "Experienced", "Callside"];
        if (mateMode === "costumes") tabNames = ["Store", "Catalog", "Callside"];

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
            if (mateMode === "costumes") {
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

        if (tabsContainer.querySelector(".dex-tab")) tabsContainer.querySelector(".dex-tab").click();

        // Intentionally omitted on groups page: abilities, evolutions, moves.
        document.getElementById("abilityContainer").innerHTML = mateMode === "costumes"
          ? renderObtainmentHtml(mate)
          : "";
        document.getElementById("evolutionsContainer").innerHTML = "";

        const paraContainer = document.getElementById("paraTypesContainer");
        paraContainer.innerHTML = mate.paraTypes ? `<b>Para Types:</b> ${mate.paraTypes.map(p => typeTag(p)).join("")}` : "";
      }

      const sacredC = document.getElementById("sacredContainer");
      const ModeC = document.getElementById("ModeContainer");
      sacredC.innerHTML = "";
      ModeC.innerHTML = "";
      const modeForms = (allData[mateMode] || []).map(m => ({ ...m, mode: mateMode }));

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
            ModeC.appendChild(img);
          });
        }
      }

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
            sacredC.appendChild(img);
          });
        }
      }
    }

    function setModeBadge(mode, mate) {
      const rarityText = getRarities(mate).join("+");
      modeBadge.textContent = mode ? `${mode.toUpperCase()} | ${rarityText}` : rarityText;
    }

    function typeTag(typeName) {
      const t = typesData.find(x => x.name === typeName);
      return `<span style="background:${t ? t.color : "#ccc"}">${escapeHtml(typeName)}</span>`;
    }

    function getMateBiomes(mate) {
      if (!mate) return [];
      if (mate.mode === "costumes") return [];
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

    function getMateSubBiomes(mate, parent) {
        if (!mate) return [];
        const source = mate.subBiomes !== undefined ? mate : resolveReferenceRoot(mate);
        return mateSubBiomes(source, parent);
    }

    function mateVitalsHtml(mate) {
      if (mate.mode === "costumes") return "";
      const biomes = getMateBiomes(mate);
      const biomeText = biomes.length ? biomes.map(b => escapeHtml(b)).join(", ") : "Unknown";
      const height = escapeHtml(mate.height || "Unknown");
      const color = escapeHtml(mate.color || "Unknown");
      return `<div class="mate-meta"><p><b>Biomes:</b> ${biomeText}</p><p><b>Height:</b> ${height}</p><p><b>Color:</b> ${color}</p></div>`;
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
      const typeObj = typesData.find(t => t.name === primaryType);
      const outlineColor = typeObj ? typeObj.color : "#ccc";
      el.style.setProperty("--outline-color", outlineColor);
      el.style.border = `3px solid ${outlineColor}`;
    }

    function sameMate(a, b) {
      return (a.name === b.name) && (getResolvedMateRef(a) === getResolvedMateRef(b)) && ((a.mode || "") === (b.mode || ""));
    }

    function escapeHtml(str) {
      if (str === null || str === undefined) return "";
      return String(str).replace(/[&<>"']/g, s => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[s]));
    }

    search.addEventListener("input", renderGroups);
    groupView.addEventListener("change", renderGroups);

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
}
const remoteScripts = []

function loadRemoteScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-upro-src="${src}"]`)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.dataset.uproSrc = src
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

export default function CatalogPage() {
  useEffect(() => {
    document.title = "Catalog"
    document.body.className = "animatrix-groups-page"
    document.body.setAttribute('style', "")

    let cancelled = false

    async function startPage() {
      for (const src of remoteScripts) {
        await loadRemoteScript(src)
      }
      if (cancelled) return

      window.onload = null
      runPageScript()
      document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }))
      window.dispatchEvent(new Event('load'))
      if (typeof window.onload === 'function') {
        window.onload()
      }
    }

    startPage().catch(error => console.error(error))

    return () => {
      cancelled = true
      window.onload = null
    }
  }, [])

  return (
    <>
      {pageStyles && <style>{pageStyles}</style>}
      <div className="upro-page-root"><header>
    <div style={{display: 'flex', gap: 10, justifyContent: 'center'}}>
      <a href="/"><button>Main Menu</button></a>
      <a href="/animatrix"><button>Return</button></a>
    </div>
    <h1>The Catalog</h1>
    <div className="controls">
      <input type="text" id="search" placeholder="Search..." />
      <label htmlFor="groupView">View: </label>
      <select id="groupView" defaultValue="cards">
        <option value="cards">Group cards</option>
        <option value="expanded">All Animates</option>
      </select>
    </div>
  </header>
  <main id="categoryGroups" />
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
        <div className="dex-tabs" />
        <p id="mateDexText" />
        <div id="mateVitals" className="mate-vitals" />
        <div id="abilityContainer" />
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
  </div></div>
    </>
  )
}
