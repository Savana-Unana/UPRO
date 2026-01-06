let currentMode = "base";
let pokedexData = [];
let allData = {}; // store all JSON data for cross-referencing
let typesData = [];
let abilitiesData = [];
let currentMonIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  const pokedex = document.getElementById("pokedex");
  const gridView = document.getElementById("gridView");
  const listView = document.getElementById("listView");
  const search = document.getElementById("search");

  // custom filter UI elements
  const typeToggle = document.getElementById("typeToggle");
  const typePanel = document.getElementById("typePanel");
  const typeOptionsEl = document.getElementById("typeOptions");
  const clearTypes = document.getElementById("clearTypes");

  const paraToggle = document.getElementById("paraToggle");
  const paraPanel = document.getElementById("paraPanel");
  const paraOptionsEl = document.getElementById("paraOptions");
  const clearParas = document.getElementById("clearParas");

  const modal = document.getElementById("detailsModal");
  const closeModal = document.getElementById("closeModal");
  const nextMon = document.getElementById("nextMon");
  const prevMon = document.getElementById("prevMon");
  const modeBadge = document.getElementById("modeBadge");

  // mode buttons
  const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));

  // Load types first
  fetch("data/types.json")
    .then(res => res.json())
    .then(types => {
      typesData = types || [];
      populateFilterOptions(typesData, typeOptionsEl);
      populateFilterOptions(typesData, paraOptionsEl);

      // load abilities and all mode JSONs
      return Promise.all([
        fetch("data/abilities.json").then(r => r.json()).catch(() => []),
        fetch("data/mons/base.json").then(r => r.json()).catch(() => []),
        fetch("data/mons/sacred.json").then(r => r.json()).catch(() => []),
        fetch("data/mons/ace.json").then(r => r.json()).catch(() => []),
        fetch("data/mons/ncanon.json").then(r => r.json()).catch(() => []),
        fetch("data/mons/event.json").then(r => r.json()).catch(() => []),
        fetch("data/mons/costumes.json").then(r => r.json()).catch(() => []),
        fetch("data/mons/npc.json").then(r => r.json()).catch(() => []),
      ]);
    })
    .then(([abilities, base, sacred, ace, ncanon, event, costumes, npc]) => {
      abilitiesData = abilities || [];
      allData = { base: base || [], sacred: sacred || [], ace: ace || [], ncanon: ncanon || [], event: event || [], costumes: costumes || [], npc: npc || [] };
      loadMode("base");
    })
    .catch(err => {
      console.error("Failed to load JSON data", err);
    });

  // Build checkbox list for a panel
  function populateFilterOptions(types, container) {
    container.innerHTML = "";
    types.forEach(t => {
      const row = document.createElement("label");
      row.className = "opt";
      row.innerHTML = `<input type="checkbox" value="${escapeHtml(t.name)}"> <span>${escapeHtml(t.name)}</span>`;
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
  setupToggle(paraToggle, paraPanel);

  // Clear buttons
  clearTypes.addEventListener("click", () => {
    clearCheckboxes(typeOptionsEl);
    renderPokedex();
  });
  clearParas.addEventListener("click", () => {
    clearCheckboxes(paraOptionsEl);
    renderPokedex();
  });

  // Wire checkbox changes to re-render
  typeOptionsEl.addEventListener("change", renderPokedex);
  paraOptionsEl.addEventListener("change", renderPokedex);

  // Mode switching
  modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      modeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadMode(btn.dataset.mode);
    });
  });

  function loadMode(mode) {
    currentMode = mode;
    pokedexData = Array.isArray(allData[mode]) ? allData[mode] : [];
    renderPokedex();
  }

  function renderPokedex() {
    pokedex.innerHTML = "";
    const term = (search.value || "").trim().toLowerCase();
    const selectedTypes = getCheckedValues(typeOptionsEl);
    const selectedParas = getCheckedValues(paraOptionsEl);

    const intersects = (a, b) => Array.isArray(a) && Array.isArray(b) && a.some(x => b.includes(x));

    pokedexData
      .filter(mon => {
        if (!mon) return false;
        if (term && !(mon.name || "").toLowerCase().includes(term)) return false;
        if (selectedTypes.length) {
          if (!mon.types || !intersects(selectedTypes, mon.types)) return false;
        }
        if (selectedParas.length) {
          if (!mon.paraTypes || !intersects(selectedParas, mon.paraTypes)) return false;
        }
        return true;
      })
      .forEach(mon => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${escapeHtml(mon.image || '')}" alt="${escapeHtml(mon.name)}">
          <h3>${escapeHtml(mon.name)}</h3>
          <div class="types">${(mon.types || []).map(t => typeTag(t)).join("")}</div>
          ${(mon.paraTypes || []).length ? `<div class="types">${mon.paraTypes.map(p => typeTag(p)).join("")}</div>` : ""}
        `;
        card.addEventListener("click", () => openDetails(mon));
        pokedex.appendChild(card);
      });
  }

  function typeTag(typeName) {
    const t = typesData.find(x => x.name === typeName);
    return `<span style="background:${t ? t.color : '#ccc'}">${escapeHtml(typeName)}</span>`;
  }

  gridView.addEventListener("click", () => {
    gridView.classList.add("active");
    listView.classList.remove("active");
    pokedex.className = "grid";
  });
  listView.addEventListener("click", () => {
    listView.classList.add("active");
    gridView.classList.remove("active");
    pokedex.className = "list";
  });

  search.addEventListener("input", renderPokedex);

  // Details modal logic
  function openDetails(mon) {
    // set mode badge and activate mode button if possible
    const monMode = mon.mode || currentMode;
    setModeBadge(monMode);
    activateModeButton(monMode);

    // set currentMonIndex to the index within the current filtered pokedexData, if present
    const idx = pokedexData.findIndex(m => m.name === mon.name && (m.id === mon.id || !mon.id));
    currentMonIndex = idx >= 0 ? idx : 0;

    updateDetails(mon);
    modal.classList.remove("hidden");
  }

  function updateDetails(mon) {
    document.getElementById("monName").textContent = mon.name || "";
    document.getElementById("monImage").src = mon.image || "";

    // Types (hide for NPCs)
    document.getElementById("monTypes").innerHTML = currentMode !== "npc"
      ? (mon.types || []).map(t => typeTag(t)).join("")
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
          <div><strong>Description: </strong>${escapeHtml(mon.Description || "None")}</div>
          <div><strong>Quest:</strong> ${escapeHtml(mon.quest || "None")}</div>
          <div><strong>Reference:</strong> ${escapeHtml(mon.reference || "None")}</div>
      `;
      document.getElementById("monDexText").innerHTML = npcHtml;
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
            if (name === "Store") text = mon.store || "No entry yet.";
            else if (name === "Catalog") text = mon.catalog || mon.description || "No entry yet.";
            else text = mon.reverense || "No entry yet";
          } else {
            text = mon.dexEntries ? (mon.dexEntries[name] || mon.description) : mon.description;
          }

          document.getElementById("monDexText").textContent = text;
        };

        tabsContainer.appendChild(tabBtn);
      });

      // show first tab content immediately
      tabsContainer.querySelector(".dex-tab").click();

      // Abilities container
      const abilityContainer = document.getElementById("abilityContainer");
      abilityContainer.innerHTML = "";
      if (mon.ability) {
        const ab = abilitiesData.find(a => a.name === mon.ability);
        abilityContainer.innerHTML = ab
          ? `<b>Ability:</b><div style="margin-top:6px;"><strong>${escapeHtml(ab.name)}</strong> &mdash; ${escapeHtml(ab.text)}</div>`
          : `<b>Ability:</b> <div>${escapeHtml(mon.ability)}</div>`;
      }

      // Para types
      const paraContainer = document.getElementById("paraTypesContainer");
      paraContainer.innerHTML = mon.paraTypes ? `<b>Para Types:</b> ${mon.paraTypes.map(p => typeTag(p)).join("")}` : "";

      // Evolutions
      const evoC = document.getElementById("evolutionsContainer");
      evoC.innerHTML = "";
      if (mon.evolvesTo && mon.evolvesTo.length) {
        evoC.innerHTML = "<b>Evolutions:</b><br>";
        mon.evolvesTo.forEach(e => {
          const allFormsFlat = Object.values(allData).flat();
          const evo = allFormsFlat.find(x => x.name === e.name);
          if (evo) {
            const img = document.createElement("img");
            img.src = evo.image || "";
            img.title = `${e.name} (Lvl ${e.level})`;
            img.onclick = () => openDetails(evo);
            evoC.appendChild(img);
          }
        });
      }
    }

    // Alternate forms still shown for both NPCs and non-NPCs
    const sacredC = document.getElementById("sacredContainer");
    sacredC.innerHTML = "";
    const allForms = Object.entries(allData).flatMap(([mode, mons]) => mons.map(m => ({ ...m, mode })));
    const sameSpecies = mon.id ? allForms.filter(f => f.id === mon.id) : allForms.filter(f => f.name === mon.name);
    const otherForms = sameSpecies.filter(f => !(f.name === mon.name && f.mode === (mon.mode || currentMode)));

    if (otherForms.length) {
      sacredC.innerHTML = "<b>Alternate Forms:</b><br>";
      otherForms.forEach(form => {
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


  // Mode badge + auto-activate mode button
  function setModeBadge(mode) {
    modeBadge.textContent = mode ? mode.toUpperCase() : "";
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

  nextMon.onclick = () => {
    if (!pokedexData || pokedexData.length === 0) return;
    currentMonIndex = (currentMonIndex + 1) % pokedexData.length;
    updateDetails(pokedexData[currentMonIndex]);
  };
  prevMon.onclick = () => {
    if (!pokedexData || pokedexData.length === 0) return;
    currentMonIndex = (currentMonIndex - 1 + pokedexData.length) % pokedexData.length;
    updateDetails(pokedexData[currentMonIndex]);
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
