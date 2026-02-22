let allData = {};
let typesData = [];
let visibleMates = [];
let currentMateIndex = 0;
let groupsData = [];

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

  fetch("data/types.json")
    .then(r => r.json())
    .then(types => {
      typesData = types || [];
      return Promise.all([
        fetch("data/mates/groups.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/base.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/sacred.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/ace.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/ncanon.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/costumes.json").then(r => r.json()).catch(() => []),
        fetch("data/mates/npc.json").then(r => r.json()).catch(() => []),
      ]);
    })
    .then(([groups, base, sacred, ace, ncanon, costumes, npc]) => {
      groupsData = Array.isArray(groups) ? groups : [];
      allData = {
        base: base || [],
        sacred: sacred || [],
        ace: ace || [],
        ncanon: ncanon || [],
        costumes: costumes || [],
        npc: npc || [],
        event: []
      };

      Object.entries(allData).forEach(([mode, mates]) => {
        if (mode === "event") return;
        allData[mode] = mates.filter(mate => {
          if (mate.event !== undefined && mate.event !== null) {
            mate.mode = "event";
            allData.event.push(mate);
            return false;
          }
          return true;
        });
      });

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

    groupsData.forEach(group => {
      const groupName = (group && group.name) ? String(group.name) : "Unnamed Group";
      const nameList = Array.isArray(group?.animates) ? group.animates : [];

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
        const key = `${m.mode || ""}|${m.id ?? ""}|${m.name || ""}|${m.image || ""}`;
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
      section.className = "cat-section";

      const title = document.createElement("h2");
      title.className = "cat-title";
      title.textContent = `${groupName} (${filtered.length})`;
      section.appendChild(title);

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

      groupsRoot.appendChild(section);
    });

    if (!groupsRoot.children.length) {
      groupsRoot.innerHTML = `<div class="cat-empty">No groups defined. Add entries to data/mates/groups.json.</div>`;
    }
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

    const lostImage = mate.image && mate.image.toLowerCase().includes("lostimages");
    const displayName = escapeHtml(mate.name) + (lostImage ? "*" : "");
    const shiverBadge = isShiver(mate)
      ? `<img class="rarity-shiver-badge" src="webimages/Shiver.png" alt="Shiver" title="Shiver">`
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
      document.getElementById("abilityContainer").innerHTML = "";
      document.getElementById("paraTypesContainer").innerHTML = "";
      document.getElementById("evolutionsContainer").innerHTML = "";
      const npcHtml = `
        <div><strong>Description: </strong>${escapeHtml(mate.Description || "None")}</div>
        <div><strong>Quest:</strong> ${escapeHtml(mate.quest || "None")}</div>
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
      document.getElementById("abilityContainer").innerHTML = "";
      document.getElementById("evolutionsContainer").innerHTML = "";

      const paraContainer = document.getElementById("paraTypesContainer");
      paraContainer.innerHTML = mate.paraTypes ? `<b>Para Types:</b> ${mate.paraTypes.map(p => typeTag(p)).join("")}` : "";
    }

    const sacredC = document.getElementById("sacredContainer");
    sacredC.innerHTML = "";
    const hasValidId = mate.id !== undefined && mate.id !== null;
    const modeForms = (allData[mateMode] || []).map(m => ({ ...m, mode: mateMode }));
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
          sacredC.appendChild(img);
        });
      }
    }

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
    return [];
  }

  function biomeImagePath(biomeName) {
    if (!biomeName) return "";
    return `webimages/biomes/${encodeURIComponent(String(biomeName).trim())}.png`;
  }

  function mateVitalsHtml(mate) {
    const biomes = getMateBiomes(mate);
    const biomeText = biomes.length ? biomes.map(b => escapeHtml(b)).join(", ") : "Unknown";
    const height = escapeHtml(mate.height || "Unknown");
    const color = escapeHtml(mate.color || "Unknown");
    return `<div class="mate-meta"><p><b>Biomes:</b> ${biomeText}</p><p><b>Height:</b> ${height}</p><p><b>Color:</b> ${color}</p></div>`;
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
    return (a.name === b.name) && ((a.id ?? null) === (b.id ?? null)) && ((a.mode || "") === (b.mode || ""));
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
