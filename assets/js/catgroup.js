let allData = {};
let typesData = [];
let visibleMates = [];
let currentMateIndex = 0;
let groupsData = [];
let crossTabFormsByRef = new Map();
let mateByName = new Map();

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

  return {
    ...group,
    name: group.name ? String(group.name) : "Unnamed Group",
    type: normalizedType,
    description: typeof group.description === "string" ? group.description.trim() : "",
    animates: Array.isArray(group.animates) ? group.animates : []
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const groupsRoot = document.getElementById("categoryGroups");
  const search = document.getElementById("search");
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

  fetch("data/types.json")
    .then(r => r.json())
    .then(types => {
      typesData = types || [];
      return Promise.all([
        fetch("data/mates/groups.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/base.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/sacred.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/ace.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/goner.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/ncanon.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/costumes.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/npc.json").then(r => r.json()).catch(() => []),
      ]);
    })
    .then(([groups, base, sacred, ace, goner, ncanon, costumes, npc]) => {
      groupsData = Array.isArray(groups) ? groups.map(normalizeGroup) : [];
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
        if (term && !(mate.name || "").toLowerCase().includes(term)) return false;
        return true;
      });

      const section = document.createElement("section");
      section.className = group.type === "bonus" ? "cat-section cat-section-bonus" : "cat-section";

      const title = document.createElement("h2");
      title.className = "cat-title";
      title.textContent = `${groupName} (${filtered.length})`;
      section.appendChild(title);

      if (group.type === "bonus" && group.description) {
        const description = document.createElement("p");
        description.className = "cat-description";
        description.textContent = group.description;
        section.appendChild(description);
      }

      if (!filtered.length) {
        const empty = document.createElement("div");
        empty.className = "cat-empty";
        empty.textContent = "No matching animates.";
        section.appendChild(empty);
      } else {
        const grid = document.createElement("div");
        grid.className = "cat-grid";
        filtered.forEach(mate => {
          visibleMates.push(mate);
          grid.appendChild(makeCard(mate));
        });
        section.appendChild(grid);
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
    card.className = "card";
    if (isParagon(mate)) card.classList.add("rarity-paragon");
    const firstBiome = getMateBiomes(mate)[0];
    if (firstBiome) {
      card.classList.add("biome-bg");
      card.style.setProperty("--biome-image", `url('${biomeImagePath(firstBiome)}')`);
    }
    applyMateStyle(card, mate);

    const lostImage = mate.image && mate.image.toLowerCase().includes("assets/images/mates/lost");
    const displayName = escapeHtml(mate.name) + (lostImage ? "*" : "");
    const shiverBadge = isShiver(mate)
      ? `<img class="rarity-shiver-badge" src="assets/images/ui/Shiver.png" alt="Shiver" title="Shiver">`
      : "";

    card.innerHTML = `
      ${shiverBadge}
      <img src="${escapeHtml(mate.image || "")}" alt="${escapeHtml(mate.name || "")}">
      <h3>${displayName}</h3>
      ${(mate.event === "fools" || mate.mode === "npc") ? "" : `
        <div class="types">${(mate.types || []).map(t => typeTag(t)).join("")}</div>
        ${(mate.paraTypes || []).length ? `<div class="types">${mate.paraTypes.map(p => typeTag(p)).join("")}</div>` : ""}
      `}
    `;

    card.addEventListener("click", () => openDetails(mate));
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
    document.getElementById("mateTypes").innerHTML = mateMode !== "npc"
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
        <div><strong>Reference:</strong> ${escapeHtml(mate.reference || "None")}</div>
      `;
      document.getElementById("mateDexText").innerHTML = npcHtml;
    } else {
      let tabNames = ["Discovered", "First Caught", "Experienced", "Reverense"];
      if (mateMode === "costumes") tabNames = ["Store", "Catalog", "Reverense"];

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
            else text = mate.reverense || "No entry yet";
          } else {
            text = mate.dexEntries ? (mate.dexEntries[name] || mate.description) : mate.description;
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
    sacredC.innerHTML = "";
    const modeForms = (allData[mateMode] || []).map(m => ({ ...m, mode: mateMode }));
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

    const ModeC = document.getElementById("ModeContainer");
    ModeC.innerHTML = "";
    {
      const mateRef = getResolvedMateRef(mate);
      const sameSpeciesSameMode = modeForms.filter(f => getResolvedMateRef(f) === mateRef);
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
          ModeC.appendChild(img);
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

  function biomeImagePath(biomeName) {
    if (!biomeName) return "";
    return `assets/images/ui/biomes/${encodeURIComponent(String(biomeName).trim())}.png`;
  }

  function mateVitalsHtml(mate) {
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
