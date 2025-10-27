let currentMode = "base";
let pokedexData = [];
let allData = {}; // ★ store all JSON data for cross-referencing
let typesData = [];
let currentMonIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  const pokedex = document.getElementById("pokedex");
  const gridView = document.getElementById("gridView");
  const listView = document.getElementById("listView");
  const search = document.getElementById("search");
  const typeFilter = document.querySelectorAll("#typeFilter")[0];
  const paraFilter = document.querySelectorAll("#typeFilter")[1]; // ★ para-type dropdown

  const modal = document.getElementById("detailsModal");
  const closeModal = document.getElementById("closeModal");
  const nextMon = document.getElementById("nextMon");
  const prevMon = document.getElementById("prevMon");

  // Load types first
  fetch("data/types.json").then(res => res.json()).then(types => {
    typesData = types;
    types.forEach(t => {
      const opt1 = document.createElement("option");
      opt1.value = t.name;
      opt1.textContent = t.name;
      typeFilter.appendChild(opt1);

      const opt2 = document.createElement("option");
      opt2.value = t.name;
      opt2.textContent = t.name;
      paraFilter.appendChild(opt2);
    });

    // ★ Load all jsons at once so we can cross-match by id
    Promise.all([
      fetch("data/base.json").then(r => r.json()),
      fetch("data/sacred.json").then(r => r.json()),
      fetch("data/ace.json").then(r => r.json()),
      fetch("data/ncanon.json").then(r => r.json()),
      fetch("data/event.json").then(r => r.json()),
    ]).then(([base, sacred, ace, ncanon, event]) => {
      allData = { base, sacred, ace, ncanon, event };
      loadMode("base");
    });
  });

  function loadMode(mode) {
    currentMode = mode;
    pokedexData = allData[mode] || [];
    renderPokedex();
  }

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadMode(btn.dataset.mode);
    });
  });

  function renderPokedex() {
    pokedex.innerHTML = "";
    const term = search.value.toLowerCase();
    const type = typeFilter.value;
    const para = paraFilter.value;

    pokedexData
      .filter(mon =>
        (!term || mon.name.toLowerCase().includes(term)) &&
        (!type || mon.types.includes(type)) &&
        (!para || (mon.paraTypes && mon.paraTypes.includes(para)))
      )
      .forEach(mon => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${mon.image}" alt="${mon.name}">
          <h3>${mon.name}</h3>
          <div class="types">${mon.types.map(t => typeTag(t)).join("")}</div>
          ${mon.paraTypes && mon.paraTypes.length
            ? `<div class="types">${mon.paraTypes.map(p => typeTag(p)).join("")}</div>`
            : ""}
        `;
        card.addEventListener("click", () => openDetails(mon));
        pokedex.appendChild(card);
      });
  }

  function typeTag(typeName) {
    const t = typesData.find(x => x.name === typeName);
    return `<span style="background:${t ? t.color : "#ccc"}">${typeName}</span>`;
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
  typeFilter.addEventListener("change", renderPokedex);
  paraFilter.addEventListener("change", renderPokedex);

  function openDetails(mon) {
    currentMonIndex = pokedexData.findIndex(m => m.name === mon.name);
    updateDetails(mon);
    modal.classList.remove("hidden");
  }

  function updateDetails(mon) {
    document.getElementById("monName").textContent = mon.name;
    document.getElementById("monImage").src = mon.image;
    document.getElementById("monTypes").innerHTML = mon.types.map(t => typeTag(t)).join("");

    const dexText = mon.dexEntries ? mon.dexEntries["Discovered"] || mon.description : mon.description;
    document.getElementById("monDexText").textContent = dexText;

    const paraContainer = document.getElementById("paraTypesContainer");
    paraContainer.innerHTML = mon.paraTypes
      ? `<b>Para Types:</b> ${mon.paraTypes.map(p => typeTag(p)).join("")}`
      : "";

    const evoC = document.getElementById("evolutionsContainer");
    evoC.innerHTML = "";
    if (mon.evolvesTo && mon.evolvesTo.length > 0) {
      evoC.innerHTML = "<b>Evolutions:</b><br>";
      mon.evolvesTo.forEach(e => {
        const evo = pokedexData.find(x => x.name === e.name);
        if (evo) {
          const img = document.createElement("img");
          img.src = evo.image;
          img.title = `${e.name} (Lvl ${e.level})`;
          img.onclick = () => updateDetails(evo);
          evoC.appendChild(img);
        }
      });
    }

// --- Alternate Forms Section ---
const sacredC = document.getElementById("sacredContainer");
sacredC.innerHTML = "";

// ✅ Ensure current mon knows which mode it came from
const currentModeSafe = mon.mode || currentMode;

// ✅ Gather every Pokémon from every mode, tagged with mode
const allForms = Object.entries(allData)
  .flatMap(([mode, mons]) => mons.map(m => ({ ...m, mode })));

// ✅ Filter for same species by ID
const sameSpecies = allForms.filter(f => f.id === mon.id);

// ✅ Remove *only* the one we're currently viewing (exact match by name + mode)
const otherForms = sameSpecies.filter(f => !(f.name === mon.name && f.mode === currentModeSafe));

if (otherForms.length > 0) {
  sacredC.innerHTML = "<b>Alternate Forms:</b><br>";

  otherForms.forEach(form => {
    const img = document.createElement("img");
    img.src = form.image;
    img.title = `${form.name} (${form.mode})`;
    img.onclick = () => updateDetails(form); // form includes its mode now
    img.style.width = "80px";
    img.style.margin = "4px";
    img.style.border = "2px solid #0ff";
    img.style.borderRadius = "10px";
    img.style.cursor = "pointer";
    sacredC.appendChild(img);

    // Show sacred quest only for Sacred version if it exists
    if (form.mode === "sacred" && form.quest) {
      const questDiv = document.createElement("div");
      questDiv.innerHTML = `<div style="margin-top:4px; font-size:0.9em; color:#0ff;">
        Quest: ${form.quest}
      </div>`;
      sacredC.appendChild(questDiv);
    }
  });
}

    document.querySelectorAll(".dex-tab").forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll(".dex-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById("monDexText").textContent = mon.dexEntries
          ? mon.dexEntries[tab.dataset.entry] || mon.description
          : mon.description;
      };
    });
  }

  closeModal.onclick = () => modal.classList.add("hidden");
  nextMon.onclick = () => {
    currentMonIndex = (currentMonIndex + 1) % pokedexData.length;
    updateDetails(pokedexData[currentMonIndex]);
  };
  prevMon.onclick = () => {
    currentMonIndex = (currentMonIndex - 1 + pokedexData.length) % pokedexData.length;
    updateDetails(pokedexData[currentMonIndex]);
  };
});
