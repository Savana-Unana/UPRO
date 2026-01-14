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

  const paraToggle = document.getElementById("paraToggle");
  const paraPanel = document.getElementById("paraPanel");
  const paraOptionsEl = document.getElementById("paraOptions");
  const clearParas = document.getElementById("clearParas");

  const modal = document.getElementById("detailsModal");
  const closeModal = document.getElementById("closeModal");
  const nextMate = document.getElementById("nextMate");
  const prevMate = document.getElementById("prevMate");
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
      const allMons = Object.entries(allData).flatMap(
        ([mode, mons]) => mons.map(m => ({ ...m, mode }))
      );

      const isMate = m => m.mode !== "npc";
      const isNPC = m => m.mode === "npc";

      // ---------- UNIQUE HELPERS ----------
      const uniqueByIdOrName = mons => {
        const map = new Map();
        mons.forEach(m => {
          const key = m.id ?? `name:${m.name}`;
          if (!map.has(key)) map.set(key, m);
        });
        return [...map.values()];
      };

      // ---------- UNIQUE MATES BY MODE ----------
      const uniqueBase = uniqueByIdOrName(allData.base || []);
      const uniqueSacred = uniqueByIdOrName(allData.sacred || []);
      const uniqueAce = uniqueByIdOrName(allData.ace || []);
      const uniqueNCanon = uniqueByIdOrName(allData.ncanon || []);
      const uniqueNPCs = uniqueByIdOrName(allData.npc || []);

      // ---------- BASE-ONLY TYPING STATS ----------
      const typeCount = {};
      const paraTypeCount = {};
      const primaryTypeCount = {};

      (allData.base || []).forEach(mon => {
        const types = mon.types?.length ? mon.types : ["null"];
        const paras = mon.paraTypes?.length ? mon.paraTypes : ["null"];

        types.forEach(t => {
          typeCount[t] = (typeCount[t] || 0) + 1;
        });

        paras.forEach(p => {
          paraTypeCount[p] = (paraTypeCount[p] || 0) + 1;
        });

        const primary = types[0] ?? "null";
        primaryTypeCount[primary] = (primaryTypeCount[primary] || 0) + 1;
      });

      // ---------- IMAGE STATS ----------
      let fromImages = 0;
      let fromLost = 0;
      let missingNo = 0;
      let costumed = 0;

      allMons.filter(isMate).forEach(mon => {
        const img = mon.image || "";

        if (img.includes("MissingNo") || img.includes("L.MissingNo")) {
          missingNo++;
          return;
        }

        if (img.includes("cimages")) {
          costumed++;
          return;
        }

        if (img.includes("lostimages")) {
          fromLost++;
          return;
        }

        if (img.includes("images")) {
          fromImages++;
        }
      });

      // ---------- OUTPUT ----------
      statsContent.innerHTML = `
        <h3>Unique Mates by Mode</h3>
        <ul>
          <li><b>Base:</b> ${uniqueBase.length}</li>
          <li><b>Sacred:</b> ${uniqueSacred.length}</li>
          <li><b>Ace:</b> ${uniqueAce.length}</li>
          <li><b>Non-Canon:</b> ${uniqueNCanon.length}</li>
          <li><b>NPCs:</b> ${uniqueNPCs.length}</li>
        </ul>

        <h3>Base-Only Typing Stats</h3>
        <h4>All Types</h4>
        ${renderCounts(typeCount)}

        <h4>Para-Types</h4>
        ${renderCounts(paraTypeCount)}

        <h4>Primary Types</h4>
        ${renderCounts(primaryTypeCount)}

        <h3>Image Sources</h3>
        <ul>
          <li><b>Images tab:</b> ${fromImages}</li>
          <li><b>Lostimages (not MissingNo):</b> ${fromLost}</li>
          <li><b>Costumed (cimages):</b> ${costumed}</li>
          <li><b>MissingNo (all variants):</b> ${missingNo}</li>
        </ul>
      `;
    }

function renderCounts(obj) {
  if (!Object.keys(obj).length) return "<i>None</i>";
  return `
    <ul>
      ${Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `<li>${escapeHtml(k)}: ${v}</li>`)
        .join("")}
    </ul>
  `;
}

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
    renderAnimatrix();
  });
  clearParas.addEventListener("click", () => {
    clearCheckboxes(paraOptionsEl);
    renderAnimatrix();
  });

  // Wire checkbox changes to re-render
  typeOptionsEl.addEventListener("change", renderAnimatrix);
  paraOptionsEl.addEventListener("change", renderAnimatrix);

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
    animatrixData = Array.isArray(allData[mode]) ? allData[mode] : [];
    renderAnimatrix();
  }

  function renderAnimatrix() {
    animatrix.innerHTML = "";
    const term = (search.value || "").trim().toLowerCase();
    const selectedTypes = getCheckedValues(typeOptionsEl);
    const selectedParas = getCheckedValues(paraOptionsEl);

    const intersects = (a, b) => Array.isArray(a) && Array.isArray(b) && a.some(x => b.includes(x));

    animatrixData
      .filter(mate => {
        if (!mate) return false;
        if (term && !(mate.name || "").toLowerCase().includes(term)) return false;
        if (selectedTypes.length) {
          if (!mate.types || !intersects(selectedTypes, mate.types)) return false;
        }
        if (selectedParas.length) {
          if (!mate.paraTypes || !intersects(selectedParas, mate.paraTypes)) return false;
        }
        if (currentMode === "npc" && mate.cosmark === "Y") return false;
        return true;
      })
      .forEach(mate => {
        const card = document.createElement("div");
        card.className = "card";
        applyMateStyle(card, mate);
        // Border color based on primary typing
        const primaryType = (mate.types && mate.types[0]) || null;
        const typeObj = typesData.find(t => t.name === primaryType);


        // Inner HTML for the card
        card.innerHTML = `
          <img src="${escapeHtml(mate.image || '')}" alt="${escapeHtml(mate.name)}">
          <h3>${escapeHtml(mate.name)}</h3>
          ${(mate.event === "fools") ? "" : `
            <div class="types">${(mate.types || []).map(t => typeTag(t)).join("")}</div>
            ${(mate.paraTypes || []).length ? `<div class="types">${mate.paraTypes.map(p => typeTag(p)).join("")}</div>` : ""}
          `}
        `;

        card.addEventListener("click", () => openDetails(mate));
        animatrix.appendChild(card);
      });
  }

  function typeTag(typeName) {
    const t = typesData.find(x => x.name === typeName);
    return `<span style="background:${t ? t.color : '#ccc'}">${escapeHtml(typeName)}</span>`;
  }

  gridView.addEventListener("click", () => {
    gridView.classList.add("active");
    listView.classList.remove("active");
    animatrix.className = "grid";
  });
  listView.addEventListener("click", () => {
    listView.classList.add("active");
    gridView.classList.remove("active");
    animatrix.className = "list";
  });

  search.addEventListener("input", renderAnimatrix);

  // Details modal logic
  function openDetails(mate) {
    // set mode badge and activate mode button if possible
    const mateMode = mate.mode || currentMode;
    setModeBadge(mateMode);
    activateModeButton(mateMode);

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
    el.style.border = `3px solid ${typeObj ? typeObj.color : "#ccc"}`;
  }


  function updateDetails(mate) {
    const modalContent =
    document.querySelector("#detailsModal .modal-content") ||
    document.getElementById("detailsModal");
    applyMateStyle(modalContent, mate);
    document.getElementById("mateName").textContent = mate.name || "";
    document.getElementById("mateImage").src = mate.image || "";

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

      // Evolutions
      const evoC = document.getElementById("evolutionsContainer");
      evoC.innerHTML = "";
      if (mate.evolvesTo && mate.evolvesTo.length) {
        evoC.innerHTML = "<b>Evolutions:</b><br>";
        mate.evolvesTo.forEach(e => {
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
    const allForms = Object.entries(allData).flatMap(([mode, mates]) => mates.map(m => ({ ...m, mode })));
    const sameSpecies = mate.id ? allForms.filter(f => f.id === mate.id) : allForms.filter(f => f.name === mate.name);
    const otherForms = sameSpecies.filter(f => !(f.name === mate.name && f.mode === (mate.mode || currentMode)));

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
