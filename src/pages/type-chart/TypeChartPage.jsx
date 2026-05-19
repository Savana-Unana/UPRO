import { useEffect } from 'react'

/* eslint-disable no-unused-vars, no-redeclare */
const pageStyles = "html {\r\n                color: #FFFFFF;\r\n                background-color: #292929;\r\n                font-family: UPRO;\r\n                font-size: 15px;\r\n                line-height: 1.5;\r\n            }\r\n\r\n            table {\r\n                border-collapse: collapse;\r\n                border-spacing: 0;\r\n                margin: 0 auto 15px;\r\n                padding: 0;\r\n            }\r\n\r\n            .type-table th {\r\n                border: 2px solid #292929;\r\n                font-weight: normal;\r\n                padding: 0;\r\n            }\r\n\r\n            .type-table td {\r\n                border: 2px solid #292929;\r\n                padding: 0;\r\n            }\r\n\r\n            .type-table th a, .type-table td {\r\n                border-radius: 6px;\r\n            }\r\n\r\n            .cell-nano {\r\n                font-size: 19px;\r\n            }\r\n\r\n            .type-abbr {\r\n                background: #CCCCCC;\r\n                color: #292929;\r\n                display: inline-block;\r\n                font-size: 20px;\r\n                font-weight: bold;\r\n                height: 32px;\r\n                line-height: 32px;\r\n                text-align: center;\r\n                text-transform: uppercase;\r\n                width: 32px;\r\n            }\r\n\r\n            .type-icon-th {\r\n                background: #CCCCCC;\r\n                color: #292929;\r\n                float: left;\r\n                font-size: 20px;\r\n                font-weight: bold;\r\n                height: 32px;\r\n                line-height: 32px;\r\n                text-align: center;\r\n                text-transform: uppercase;\r\n                width: 54px;\r\n            }\r\n\r\n            .type-icon-th:first-child {\r\n                margin-left: 0;\r\n            }\r\n\r\n            .type-fx-cell {\r\n                color: #292929;\r\n                font-size: 24px;\r\n                font-weight: bold;\r\n                height: 32px;\r\n                line-height: 32px;\r\n                text-align: center;\r\n                width: 32px;\r\n            }\r\n\r\n            .type-fx-0 {\r\n                background-color: #4A4A4A;\r\n                color: white;\r\n            }\r\n\r\n            .type-fx-50 {\r\n                background-color: #F2665C;\r\n            }\r\n\r\n            .type-fx-75 {\r\n                background-color: #F2665C;\r\n                font-size: 28px;\r\n            }\r\n\r\n            .type-fx-100 {\r\n                background-color: #bebebe;\r\n            }\r\n\r\n            .type-fx-150 {\r\n                background-color: #B1D490;\r\n                font-size: 28px;\r\n            }\r\n\r\n            .type-fx-200 {\r\n                background-color: #B1D490;\r\n            }\r\n\r\n            .type-normal {\r\n                background: black url(\"assets/images/ui/types/Normal.png\") center no-repeat;\r\n            }\r\n\r\n            .type-plant {\r\n                background: black url(\"assets/images/ui/types/Plant.png\") center no-repeat;\r\n            }\r\n\r\n            .type-water {\r\n                background: black url(\"assets/images/ui/types/Water.png\") center no-repeat;\r\n            }\r\n\r\n            .type-fire {\r\n                background: black url(\"assets/images/ui/types/Fire.png\") center no-repeat;\r\n            }\r\n\r\n            .type-earth {\r\n                background: black url(\"assets/images/ui/types/Earth.png\") center no-repeat;\r\n            }\r\n\r\n            .type-ice {\r\n                background: black url(\"assets/images/ui/types/Ice.png\") center no-repeat;\r\n            }\r\n\r\n            .type-air {\r\n                background: black url(\"assets/images/ui/types/Air.png\") center no-repeat;\r\n            }\r\n\r\n            .type-metal {\r\n                background: black url(\"assets/images/ui/types/Metal.png\") center no-repeat;\r\n            }\r\n\r\n            .type-electric {\r\n                background: black url(\"assets/images/ui/types/Electric.png\") center no-repeat;\r\n            }\r\n\r\n            .type-light {\r\n                background: black url(\"assets/images/ui/types/Light.png\") center no-repeat;\r\n            }\r\n\r\n            .type-dark {\r\n                background: black url(\"assets/images/ui/types/Dark.png\") center no-repeat;\r\n            }\r\n\r\n            .type-savage {\r\n                background: black url(\"assets/images/ui/types/Savage.png\") center no-repeat;\r\n            }\r\n\r\n            .type-mystic {\r\n                background: black url(\"assets/images/ui/types/Mystic.png\") center no-repeat;\r\n            }\r\n\r\n            .type-gross {\r\n                background: black url(\"assets/images/ui/types/Gross.png\") center no-repeat;\r\n            }\r\n\r\n            .type-spectral {\r\n                background: black url(\"assets/images/ui/types/Spectral.png\") center no-repeat;\r\n            }\r\n\r\n            .type-artillery {\r\n                background: black url(\"assets/images/ui/types/Artillery.png\") center no-repeat;\r\n            }\r\n\r\n            .type-lucid {\r\n                background: black url(\"assets/images/ui/types/Lucid.png\") center no-repeat;\r\n            }"
const spectralToggleStyles = `
  .typechart-toolbar {
    align-items: center;
    display: flex;
    gap: 8px;
    justify-content: center;
    margin: 0 0 10px;
  }

  .typechart-mode-button {
    background: #bebebe;
    border: 2px solid #ffffff;
    border-radius: 6px;
    color: #292929;
    cursor: pointer;
    font-family: UPRO;
    font-size: 18px;
    line-height: 1;
    min-width: 136px;
    padding: 8px 12px;
  }

  .typechart-mode-button[aria-pressed="true"] {
    background: #B1D490;
  }
`
function runPageScript() {
  window.addEventListener("DOMContentLoaded", async function () {
      var fallbackTypings = [
          {"name":"Normal","strongAgainst":["Water","Plant"],"weakTo":["Savage","Metal","Artillery"],"immuneTo":["Spectral"]},
          {"name":"Fire","strongAgainst":["Normal","Plant","Ice","Gross","Dark","Spectral","Metal"],"weakTo":["Fire","Water","Savage","Earth"]},
          {"name":"Water","strongAgainst":["Fire","Gross","Metal","Artillery"],"weakTo":["Normal","Plant"],"immuneTo":["Spectral"]},
          {"name":"Plant","strongAgainst":["Water","Earth","Light","Spectral"],"weakTo":["Normal","Fire","Dark"]},
          {"name":"Electric","strongAgainst":["Normal","Water","Electric","Air","Mystic","Metal"],"weakTo":["Savage","Artillery"],"immuneTo":["Earth"]},
          {"name":"Ice","strongAgainst":["Water","Savage","Gross","Earth"],"weakTo":["Fire"]},
          {"name":"Savage","strongAgainst":["Normal","Fire","Plant","Savage","Air","Dark"],"weakTo":["Mystic","Light","Metal","Artillery"]},
          {"name":"Gross","strongAgainst":["Plant","Ice","Mystic","Dark"],"weakTo":["Gross","Light"]},
          {"name":"Earth","strongAgainst":["Fire","Electric","Artillery"],"weakTo":["Normal","Water","Plant","Gross"],"immuneTo":["Air"]},
          {"name":"Air","strongAgainst":["Fire","Earth","Artillery"],"weakTo":["Normal","Plant","Metal"]},
          {"name":"Mystic","strongAgainst":["Normal","Savage","Gross","Dark","Spectral","Metal"],"weakTo":["Electric","Light"]},
          {"name":"Light","strongAgainst":["Ice","Gross","Dark","Spectral"],"weakTo":["Water","Plant","Earth","Metal"]},
          {"name":"Dark","strongAgainst":["Air","Mystic","Light","Artillery"],"weakTo":["Savage","Spectral"]},
          {"name":"Spectral","strongAgainst":["Electric","Savage","Mystic","Dark"],"immuneTo":["Normal"]},
          {"name":"Metal","strongAgainst":["Fire"],"weakTo":["Plant","Electric","Savage","Metal"]},
          {"name":"Artillery","strongAgainst":["Normal","Ice","Savage","Air","Mystic","Light"],"weakTo":["Water","Earth","Metal"],"immuneTo":["Spectral"]},
          {"name":"Lucid","strongAgainst":[],"weakTo":[]}
      ];

      var info = await fetch("data/info.json").then(res => res.json()).catch(() => null);
      var typings = Array.isArray(info?.typings) && info.typings.length ? info.typings : fallbackTypings;
      var typenames = typings.map(type => type.name).filter(Boolean);

      var typechartHead = document.getElementById("typechart-head");
      var typechartBody = document.getElementById("typechart-body");
      var typestatsHead = document.getElementById("typestats-head");

      var typestatsOffense = document.getElementById("typestats-offense");
      var typestatsDefense = document.getElementById("typestats-defense");
      var typestatsOverall = document.getElementById("typestats-overall");
      var spectralModeToggle = document.getElementById("spectral-mode-toggle");
      var spectralMode = "post";

      buildTypeChart();
      applyTypingDefaults();

      var typerows = typenames.map(getElementById);

      var types = typenames.length;
      var constant = types + 1;
      var size = types * types;

      var crumbs = new Array(size);
      var index = 0;
      for (var i = 0; i < types; i++) {
          for (var j = 0; j < types; j++) {
              var id = typenames[i] + " → " + typenames[j];
              crumbs[index++] = document.getElementById(id);
          }
      }

      var typestats = typenames.map(getStats);

      hashUpdate();
      crumbs.forEach(listen);
      listenSpectralModeToggle();
      window.addEventListener("hashchange", hashUpdate, false);

      function typeClass(name) {
          return "type-" + String(name || "").toLowerCase().replace(/\s+/g, "-");
      }

      function buildTypeChart() {
          typechartHead.innerHTML = `<th class="cell-nano">DEFEND&nbsp;→<br />ATTACK&nbsp;↴</th>`;
          typenames.forEach(name => {
              var th = document.createElement("th");
              th.innerHTML = `<a class="type-abbr ${typeClass(name)}">&nbsp;</a>`;
              typechartHead.appendChild(th);
          });

          typechartBody.innerHTML = "";
          typenames.forEach(attackName => {
              var tr = document.createElement("tr");
              tr.id = attackName;
              tr.innerHTML = `<th><a class="type-icon-th ${typeClass(attackName)}">&nbsp;</a></th>`;

              typenames.forEach(defenseName => {
                  var td = document.createElement("td");
                  td.id = `${attackName} → ${defenseName}`;
                  td.className = "type-fx-cell";
                  tr.appendChild(td);
              });

              typechartBody.appendChild(tr);
          });
      }

      function setCellValue(cell, value) {
          if (!cell) return;

          switch (value) {
              case 1:
                  cell.className = "type-fx-cell type-fx-50";
                  cell.innerHTML = ".5x";
                  break;
              case 3:
                  cell.className = "type-fx-cell type-fx-200";
                  cell.innerHTML = "2x";
                  break;
              case 0:
                  cell.className = "type-fx-cell type-fx-0";
                  cell.innerHTML = "0x";
                  break;
              default:
                  cell.className = "type-fx-cell type-fx-100";
                  cell.innerHTML = "";
          }
      }

      function applyTypingDefaults() {
          typings.forEach(type => {
              var attackName = type.name;
              typenames.forEach(defenseName => {
                  var cell = document.getElementById(`${attackName} → ${defenseName}`);
                  setCellValue(cell, getTypingValue(type, defenseName));
              });
          });
      }

      function getTypingValue(type, defenseName) {
          var attackName = type.name;

          if (spectralMode === "pre" && defenseName === "Spectral") {
              if (attackName === "Plant") return 1;
              if (attackName === "Lucid") return 2;
              if (attackName === "Spectral") return 2;
              return 0;
          }

          if (Array.isArray(type.immuneTo) && type.immuneTo.includes(defenseName)) {
              return 0;
          }
          if (Array.isArray(type.strongAgainst) && type.strongAgainst.includes(defenseName)) {
              return 3;
          }
          if (Array.isArray(type.weakTo) && type.weakTo.includes(defenseName)) {
              return 1;
          }

          return 2;
      }

      function listenSpectralModeToggle() {
          if (!spectralModeToggle) return;

          spectralModeToggle.addEventListener("click", function () {
              spectralMode = spectralMode === "post" ? "pre" : "post";
              spectralModeToggle.textContent = spectralMode === "post" ? "Pre-Spectral" : "Post-Spectral";
              spectralModeToggle.setAttribute("aria-pressed", String(spectralMode === "post"));
              spectralModeToggle.title = spectralMode === "post" ? "Using the current type chart" : "Using the pre-Spectral chart";
              applyTypingDefaults();
              updateStats();
          }, false);
      }

      function hashUpdate() {
          var data = window.location.hash || getHash();
          data = concat(data.slice(1).split("").map(parse));

          var length = Math.sqrt(data.length);
          var mod = length % 1;

          if (mod !== 0) {
              length -= mod;
              data.pop();
          }

          if (length === types) {
              data.forEach(updateCrumb);
              updateStats();
          } else if (length + 1 === types) {
              var i = length * length;
              while (i > 0) {
                  data.splice(i, 0, 2);
                  i -= length;
              }
              for (var i = 0; i < types; i++) data.push(2);
              var hash = "#",
                  index = 0;
              while (index < size) {
                  var a = data[index++];
                  var b = data[index++] || 0;
                  hash += (a << 2 | b).toString(16);
              }
              window.location.href = hash.toUpperCase();
          } else throw new Error("Unexpected error");
      }

      function getElementById(id) {
          return document.getElementById(id);
      }

      function getStats(name) {
          return {
              offense: document.getElementById("Offense " + name),
              defense: document.getElementById("Defense " + name),
              overall: document.getElementById("Overall " + name)
          };
      }

      function parse(x) {
          var y = parseInt(x, 16);
          if (isNaN(y)) throw new Error("Invalid data");
          return [y >>> 2, y & 3];
      }

      function concat(xs) {
          return Array.prototype.concat.apply(Array.prototype, xs);
      }

      function updateCrumb(value, index) {
          var crumb = crumbs[index];
          switch (value) {
              case 0:
                  crumb.className = "type-fx-cell type-fx-0";
                  crumb.innerHTML = "0x";
                  break;
              case 1:
                  crumb.className = "type-fx-cell type-fx-50";
                  crumb.innerHTML = ".5x";
                  break;
              case 2:
                  crumb.className = "type-fx-cell type-fx-100";
                  crumb.innerHTML = ""; // 1x is invisible
                  break;
              case 3:
                  crumb.className = "type-fx-cell type-fx-200";
                  crumb.innerHTML = "2x";
                  break;
          }
      }

      function updateStats() {
          var typechart = crumbs.map(getValue);

          var result = new Array(types);
          var attack = new Array(types);

          for (var i = 0; i < types; i++) {
              var sigmaSquare = 0;
              var sigmaAttack = 0;

              for (var j = 0; j < types; j++) {
                  var offense = typechart[i * types + j];
                  sigmaSquare += offense * offense;
                  sigmaAttack += offense;
              }

              result[i] = sigmaAttack * (sigmaAttack + 2) - sigmaSquare;
              attack[i] = sigmaAttack;
          }

          var average = {
              offense: 0,
              defense: 0,
              overall: 0
          };

          var stats = new Array(types);

          for (var i = 0; i < types; i++) {
              var sigmaDefense = 0;

              for (var j = 0; j < types; j++) {
                  var defenses = typechart[i + types * j];
                  sigmaDefense += defenses * (attack[j] - defenses + 1);
              }

              var offense = result[i];
              var overall = Math.sqrt(types * offense / sigmaDefense / constant);

              var offenseValue = offense / types / constant;
              var defenseValue = size / sigmaDefense;
              var overallValue = overall;

              stats[i] = {
                  offense: types * offenseValue,
                  defense: types * defenseValue,
                  overall: types * overallValue
              };

              average.offense += offenseValue;
              average.defense += defenseValue;
              average.overall += overallValue;
          }

          for (var i = 0; i < types; i++) {
              var typestat = typestats[i];

              var offenseValue = Math.log(stats[i].offense / average.offense);
              var defenseValue = Math.log(stats[i].defense / average.defense);
              var overallValue = Math.log(stats[i].overall / average.overall);

              updateValue(typestat.offense, 100 * offenseValue);
              updateValue(typestat.defense, 100 * defenseValue);
              updateValue(typestat.overall, 100 * overallValue);
          }

          window.location.hash = getHash();
      }

      function getHash() {
          var data = "#",
              index = 0;

          while (index < size) {
              var a = getIndex(crumbs[index++]);
              var b = getIndex(crumbs[index++]);
              data += (a << 2 | b).toString(16);
          }
          return data.toUpperCase();
      }

      function getValue(crumb) {
          switch (crumb.innerHTML) {
              case "0x":
                  return 0 / 1;
              case ".5x":
                  return 1 / 2;
              case "": // invisible 1x
                  return 1 / 1;
              case "2x":
                  return 2 / 1;
          }
      }

      function getIndex(crumb) {
          if (crumb) {
              switch (crumb.innerHTML) {
                  case "0x":
                      return 0;
                  case ".5x":
                      return 1;
                  case "": // invisible 1x
                      return 2;
                  case "2x":
                      return 3;
              }
          }
          return 0;
      }

      function updateValue(stat, value) {
          if (!stat) return;

          stat.className = value <= -0.01 ? "type-fx-cell type-fx-75" :
              value >= 0.01 ? "type-fx-cell type-fx-150" :
              "type-fx-cell type-fx-0";

          if (stat.className === "type-fx-cell type-fx-0") value = 0;

          stat.innerHTML = value.toFixed(2);
      }

      function listen(crumb) {
          crumb.style.cursor = "pointer";

          crumb.addEventListener("mousedown", function (event) {
              event.preventDefault();

              switch (crumb.innerHTML) {
                  case "":
                      crumb.className = "type-fx-cell type-fx-200";
                      crumb.innerHTML = "2x";
                      break;
                  case "2x":
                      crumb.className = "type-fx-cell type-fx-50";
                      crumb.innerHTML = ".5x";
                      break;
                  case ".5x":
                      crumb.className = "type-fx-cell type-fx-0";
                      crumb.innerHTML = "0x";
                      break;
                  case "0x":
                      crumb.className = "type-fx-cell type-fx-100";
                      crumb.innerHTML = ""; // Back to invisible 1x
                      break;
              }
              updateStats();
          }, false);
      }
  }, false);
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

export default function TypeChartPage() {
  useEffect(() => {
    document.title = "UPRO Type Chart"
    document.body.className = ""
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
      <style>{spectralToggleStyles}</style>
      <div className="upro-page-root"><div style={{display: 'flex'}}>
    <div id="nav-btn">
      <a href="/">
        <button>Main Menu</button>
      </a>
    </div>
  </div>
  <h1 style={{marginTop: 0, marginBottom: 5}}>TypeChart</h1>
  <div className="typechart-toolbar">
    <button id="spectral-mode-toggle" className="typechart-mode-button" type="button" aria-pressed="true" title="Using the current type chart">
      Pre-Spectral
    </button>
  </div>
  <table className="type-table">
    <thead>
      <tr id="typechart-head">
        <th className="cell-nano">DEFEND&nbsp;→<br />ATTACK&nbsp;↴</th>
        <th>
          <a className="type-abbr type-normal">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-plant">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-water">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-fire">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-earth">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-ice">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-air">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-metal">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-electric">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-light">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-dark">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-savage">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-mystic">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-gross">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-spectral">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-artillery">&nbsp;</a>
        </th>
        <th>
          <a className="type-abbr type-lucid">&nbsp;</a>
        </th>
      </tr>
    </thead>
    <tbody id="typechart-body">
      <tr id="Normal">
        <th>
          <a className="type-icon-th type-normal">&nbsp;</a>
        </th>
        <td id="Normal → Normal" className="type-fx-cell" />
        <td id="Normal → Plant" className="type-fx-cell" />
        <td id="Normal → Water" className="type-fx-cell" />
        <td id="Normal → Fire" className="type-fx-cell" />
        <td id="Normal → Earth" className="type-fx-cell" />
        <td id="Normal → Ice" className="type-fx-cell" />
        <td id="Normal → Air" className="type-fx-cell" />
        <td id="Normal → Metal" className="type-fx-cell" />
        <td id="Normal → Electric" className="type-fx-cell" />
        <td id="Normal → Light" className="type-fx-cell" />
        <td id="Normal → Dark" className="type-fx-cell" />
        <td id="Normal → Savage" className="type-fx-cell" />
        <td id="Normal → Mystic" className="type-fx-cell" />
        <td id="Normal → Gross" className="type-fx-cell" />
        <td id="Normal → Spectral" className="type-fx-cell" />
        <td id="Normal → Artillery" className="type-fx-cell" />
        <td id="Normal → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Plant">
        <th>
          <a className="type-icon-th type-plant">&nbsp;</a>
        </th>
        <td id="Plant → Normal" className="type-fx-cell" />
        <td id="Plant → Plant" className="type-fx-cell" />
        <td id="Plant → Water" className="type-fx-cell" />
        <td id="Plant → Fire" className="type-fx-cell" />
        <td id="Plant → Earth" className="type-fx-cell" />
        <td id="Plant → Ice" className="type-fx-cell" />
        <td id="Plant → Air" className="type-fx-cell" />
        <td id="Plant → Metal" className="type-fx-cell" />
        <td id="Plant → Electric" className="type-fx-cell" />
        <td id="Plant → Light" className="type-fx-cell" />
        <td id="Plant → Dark" className="type-fx-cell" />
        <td id="Plant → Savage" className="type-fx-cell" />
        <td id="Plant → Mystic" className="type-fx-cell" />
        <td id="Plant → Gross" className="type-fx-cell" />
        <td id="Plant → Spectral" className="type-fx-cell" />
        <td id="Plant → Artillery" className="type-fx-cell" />
        <td id="Plant → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Water">
        <th>
          <a className="type-icon-th type-water">&nbsp;</a>
        </th>
        <td id="Water → Normal" className="type-fx-cell" />
        <td id="Water → Plant" className="type-fx-cell" />
        <td id="Water → Water" className="type-fx-cell" />
        <td id="Water → Fire" className="type-fx-cell" />
        <td id="Water → Earth" className="type-fx-cell" />
        <td id="Water → Ice" className="type-fx-cell" />
        <td id="Water → Air" className="type-fx-cell" />
        <td id="Water → Metal" className="type-fx-cell" />
        <td id="Water → Electric" className="type-fx-cell" />
        <td id="Water → Light" className="type-fx-cell" />
        <td id="Water → Dark" className="type-fx-cell" />
        <td id="Water → Savage" className="type-fx-cell" />
        <td id="Water → Mystic" className="type-fx-cell" />
        <td id="Water → Gross" className="type-fx-cell" />
        <td id="Water → Spectral" className="type-fx-cell" />
        <td id="Water → Artillery" className="type-fx-cell" />
        <td id="Water → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Fire">
        <th>
          <a className="type-icon-th type-fire">&nbsp;</a>
        </th>
        <td id="Fire → Normal" className="type-fx-cell" />
        <td id="Fire → Plant" className="type-fx-cell" />
        <td id="Fire → Water" className="type-fx-cell" />
        <td id="Fire → Fire" className="type-fx-cell" />
        <td id="Fire → Earth" className="type-fx-cell" />
        <td id="Fire → Ice" className="type-fx-cell" />
        <td id="Fire → Air" className="type-fx-cell" />
        <td id="Fire → Metal" className="type-fx-cell" />
        <td id="Fire → Electric" className="type-fx-cell" />
        <td id="Fire → Light" className="type-fx-cell" />
        <td id="Fire → Dark" className="type-fx-cell" />
        <td id="Fire → Savage" className="type-fx-cell" />
        <td id="Fire → Mystic" className="type-fx-cell" />
        <td id="Fire → Gross" className="type-fx-cell" />
        <td id="Fire → Spectral" className="type-fx-cell" />
        <td id="Fire → Artillery" className="type-fx-cell" />
        <td id="Fire → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Earth">
        <th>
          <a className="type-icon-th type-earth">&nbsp;</a>
        </th>
        <td id="Earth → Normal" className="type-fx-cell" />
        <td id="Earth → Plant" className="type-fx-cell" />
        <td id="Earth → Water" className="type-fx-cell" />
        <td id="Earth → Fire" className="type-fx-cell" />
        <td id="Earth → Earth" className="type-fx-cell" />
        <td id="Earth → Ice" className="type-fx-cell" />
        <td id="Earth → Air" className="type-fx-cell" />
        <td id="Earth → Metal" className="type-fx-cell" />
        <td id="Earth → Electric" className="type-fx-cell" />
        <td id="Earth → Light" className="type-fx-cell" />
        <td id="Earth → Dark" className="type-fx-cell" />
        <td id="Earth → Savage" className="type-fx-cell" />
        <td id="Earth → Mystic" className="type-fx-cell" />
        <td id="Earth → Gross" className="type-fx-cell" />
        <td id="Earth → Spectral" className="type-fx-cell" />
        <td id="Earth → Artillery" className="type-fx-cell" />
        <td id="Earth → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Ice">
        <th>
          <a className="type-icon-th type-ice">&nbsp;</a>
        </th>
        <td id="Ice → Normal" className="type-fx-cell" />
        <td id="Ice → Plant" className="type-fx-cell" />
        <td id="Ice → Water" className="type-fx-cell" />
        <td id="Ice → Fire" className="type-fx-cell" />
        <td id="Ice → Earth" className="type-fx-cell" />
        <td id="Ice → Ice" className="type-fx-cell" />
        <td id="Ice → Air" className="type-fx-cell" />
        <td id="Ice → Metal" className="type-fx-cell" />
        <td id="Ice → Electric" className="type-fx-cell" />
        <td id="Ice → Light" className="type-fx-cell" />
        <td id="Ice → Dark" className="type-fx-cell" />
        <td id="Ice → Savage" className="type-fx-cell" />
        <td id="Ice → Mystic" className="type-fx-cell" />
        <td id="Ice → Gross" className="type-fx-cell" />
        <td id="Ice → Spectral" className="type-fx-cell" />
        <td id="Ice → Artillery" className="type-fx-cell" />
        <td id="Ice → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Air">
        <th>
          <a className="type-icon-th type-air">&nbsp;</a>
        </th>
        <td id="Air → Normal" className="type-fx-cell" />
        <td id="Air → Plant" className="type-fx-cell" />
        <td id="Air → Water" className="type-fx-cell" />
        <td id="Air → Fire" className="type-fx-cell" />
        <td id="Air → Earth" className="type-fx-cell" />
        <td id="Air → Ice" className="type-fx-cell" />
        <td id="Air → Air" className="type-fx-cell" />
        <td id="Air → Metal" className="type-fx-cell" />
        <td id="Air → Electric" className="type-fx-cell" />
        <td id="Air → Light" className="type-fx-cell" />
        <td id="Air → Dark" className="type-fx-cell" />
        <td id="Air → Savage" className="type-fx-cell" />
        <td id="Air → Mystic" className="type-fx-cell" />
        <td id="Air → Gross" className="type-fx-cell" />
        <td id="Air → Spectral" className="type-fx-cell" />
        <td id="Air → Artillery" className="type-fx-cell" />
        <td id="Air → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Metal">
        <th>
          <a className="type-icon-th type-metal">&nbsp;</a>
        </th>
        <td id="Metal → Normal" className="type-fx-cell" />
        <td id="Metal → Plant" className="type-fx-cell" />
        <td id="Metal → Water" className="type-fx-cell" />
        <td id="Metal → Fire" className="type-fx-cell" />
        <td id="Metal → Earth" className="type-fx-cell" />
        <td id="Metal → Ice" className="type-fx-cell" />
        <td id="Metal → Air" className="type-fx-cell" />
        <td id="Metal → Metal" className="type-fx-cell" />
        <td id="Metal → Electric" className="type-fx-cell" />
        <td id="Metal → Light" className="type-fx-cell" />
        <td id="Metal → Dark" className="type-fx-cell" />
        <td id="Metal → Savage" className="type-fx-cell" />
        <td id="Metal → Mystic" className="type-fx-cell" />
        <td id="Metal → Gross" className="type-fx-cell" />
        <td id="Metal → Spectral" className="type-fx-cell" />
        <td id="Metal → Artillery" className="type-fx-cell" />
        <td id="Metal → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Electric">
        <th>
          <a className="type-icon-th type-electric">&nbsp;</a>
        </th>
        <td id="Electric → Normal" className="type-fx-cell" />
        <td id="Electric → Plant" className="type-fx-cell" />
        <td id="Electric → Water" className="type-fx-cell" />
        <td id="Electric → Fire" className="type-fx-cell" />
        <td id="Electric → Earth" className="type-fx-cell" />
        <td id="Electric → Ice" className="type-fx-cell" />
        <td id="Electric → Air" className="type-fx-cell" />
        <td id="Electric → Metal" className="type-fx-cell" />
        <td id="Electric → Electric" className="type-fx-cell" />
        <td id="Electric → Light" className="type-fx-cell" />
        <td id="Electric → Dark" className="type-fx-cell" />
        <td id="Electric → Savage" className="type-fx-cell" />
        <td id="Electric → Mystic" className="type-fx-cell" />
        <td id="Electric → Gross" className="type-fx-cell" />
        <td id="Electric → Spectral" className="type-fx-cell" />
        <td id="Electric → Artillery" className="type-fx-cell" />
        <td id="Electric → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Light">
        <th>
          <a className="type-icon-th type-light">&nbsp;</a>
        </th>
        <td id="Light → Normal" className="type-fx-cell" />
        <td id="Light → Plant" className="type-fx-cell" />
        <td id="Light → Water" className="type-fx-cell" />
        <td id="Light → Fire" className="type-fx-cell" />
        <td id="Light → Earth" className="type-fx-cell" />
        <td id="Light → Ice" className="type-fx-cell" />
        <td id="Light → Air" className="type-fx-cell" />
        <td id="Light → Metal" className="type-fx-cell" />
        <td id="Light → Electric" className="type-fx-cell" />
        <td id="Light → Light" className="type-fx-cell" />
        <td id="Light → Dark" className="type-fx-cell" />
        <td id="Light → Savage" className="type-fx-cell" />
        <td id="Light → Mystic" className="type-fx-cell" />
        <td id="Light → Gross" className="type-fx-cell" />
        <td id="Light → Spectral" className="type-fx-cell" />
        <td id="Light → Artillery" className="type-fx-cell" />
        <td id="Light → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Dark">
        <th>
          <a className="type-icon-th type-dark">&nbsp;</a>
        </th>
        <td id="Dark → Normal" className="type-fx-cell" />
        <td id="Dark → Plant" className="type-fx-cell" />
        <td id="Dark → Water" className="type-fx-cell" />
        <td id="Dark → Fire" className="type-fx-cell" />
        <td id="Dark → Earth" className="type-fx-cell" />
        <td id="Dark → Ice" className="type-fx-cell" />
        <td id="Dark → Air" className="type-fx-cell" />
        <td id="Dark → Metal" className="type-fx-cell" />
        <td id="Dark → Electric" className="type-fx-cell" />
        <td id="Dark → Light" className="type-fx-cell" />
        <td id="Dark → Dark" className="type-fx-cell" />
        <td id="Dark → Savage" className="type-fx-cell" />
        <td id="Dark → Mystic" className="type-fx-cell" />
        <td id="Dark → Gross" className="type-fx-cell" />
        <td id="Dark → Spectral" className="type-fx-cell" />
        <td id="Dark → Artillery" className="type-fx-cell" />
        <td id="Dark → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Savage">
        <th>
          <a className="type-icon-th type-savage">&nbsp;</a>
        </th>
        <td id="Savage → Normal" className="type-fx-cell" />
        <td id="Savage → Plant" className="type-fx-cell" />
        <td id="Savage → Water" className="type-fx-cell" />
        <td id="Savage → Fire" className="type-fx-cell" />
        <td id="Savage → Earth" className="type-fx-cell" />
        <td id="Savage → Ice" className="type-fx-cell" />
        <td id="Savage → Air" className="type-fx-cell" />
        <td id="Savage → Metal" className="type-fx-cell" />
        <td id="Savage → Electric" className="type-fx-cell" />
        <td id="Savage → Light" className="type-fx-cell" />
        <td id="Savage → Dark" className="type-fx-cell" />
        <td id="Savage → Savage" className="type-fx-cell" />
        <td id="Savage → Mystic" className="type-fx-cell" />
        <td id="Savage → Gross" className="type-fx-cell" />
        <td id="Savage → Spectral" className="type-fx-cell" />
        <td id="Savage → Artillery" className="type-fx-cell" />
        <td id="Savage → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Mystic">
        <th>
          <a className="type-icon-th type-mystic">&nbsp;</a>
        </th>
        <td id="Mystic → Normal" className="type-fx-cell" />
        <td id="Mystic → Plant" className="type-fx-cell" />
        <td id="Mystic → Water" className="type-fx-cell" />
        <td id="Mystic → Fire" className="type-fx-cell" />
        <td id="Mystic → Earth" className="type-fx-cell" />
        <td id="Mystic → Ice" className="type-fx-cell" />
        <td id="Mystic → Air" className="type-fx-cell" />
        <td id="Mystic → Metal" className="type-fx-cell" />
        <td id="Mystic → Electric" className="type-fx-cell" />
        <td id="Mystic → Light" className="type-fx-cell" />
        <td id="Mystic → Dark" className="type-fx-cell" />
        <td id="Mystic → Savage" className="type-fx-cell" />
        <td id="Mystic → Mystic" className="type-fx-cell" />
        <td id="Mystic → Gross" className="type-fx-cell" />
        <td id="Mystic → Spectral" className="type-fx-cell" />
        <td id="Mystic → Artillery" className="type-fx-cell" />
        <td id="Mystic → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Gross">
        <th>
          <a className="type-icon-th type-gross">&nbsp;</a>
        </th>
        <td id="Gross → Normal" className="type-fx-cell" />
        <td id="Gross → Plant" className="type-fx-cell" />
        <td id="Gross → Water" className="type-fx-cell" />
        <td id="Gross → Fire" className="type-fx-cell" />
        <td id="Gross → Earth" className="type-fx-cell" />
        <td id="Gross → Ice" className="type-fx-cell" />
        <td id="Gross → Air" className="type-fx-cell" />
        <td id="Gross → Metal" className="type-fx-cell" />
        <td id="Gross → Electric" className="type-fx-cell" />
        <td id="Gross → Light" className="type-fx-cell" />
        <td id="Gross → Dark" className="type-fx-cell" />
        <td id="Gross → Savage" className="type-fx-cell" />
        <td id="Gross → Mystic" className="type-fx-cell" />
        <td id="Gross → Gross" className="type-fx-cell" />
        <td id="Gross → Spectral" className="type-fx-cell" />
        <td id="Gross → Artillery" className="type-fx-cell" />
        <td id="Gross → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Spectral">
        <th>
          <a className="type-icon-th type-spectral">&nbsp;</a>
        </th>
        <td id="Spectral → Normal" className="type-fx-cell" />
        <td id="Spectral → Plant" className="type-fx-cell" />
        <td id="Spectral → Water" className="type-fx-cell" />
        <td id="Spectral → Fire" className="type-fx-cell" />
        <td id="Spectral → Earth" className="type-fx-cell" />
        <td id="Spectral → Ice" className="type-fx-cell" />
        <td id="Spectral → Air" className="type-fx-cell" />
        <td id="Spectral → Metal" className="type-fx-cell" />
        <td id="Spectral → Electric" className="type-fx-cell" />
        <td id="Spectral → Light" className="type-fx-cell" />
        <td id="Spectral → Dark" className="type-fx-cell" />
        <td id="Spectral → Savage" className="type-fx-cell" />
        <td id="Spectral → Mystic" className="type-fx-cell" />
        <td id="Spectral → Gross" className="type-fx-cell" />
        <td id="Spectral → Spectral" className="type-fx-cell" />
        <td id="Spectral → Artillery" className="type-fx-cell" />
        <td id="Spectral → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Artillery">
        <th>
          <a className="type-icon-th type-artillery">&nbsp;</a>
        </th>
        <td id="Artillery → Normal" className="type-fx-cell" />
        <td id="Artillery → Plant" className="type-fx-cell" />
        <td id="Artillery → Water" className="type-fx-cell" />
        <td id="Artillery → Fire" className="type-fx-cell" />
        <td id="Artillery → Earth" className="type-fx-cell" />
        <td id="Artillery → Ice" className="type-fx-cell" />
        <td id="Artillery → Air" className="type-fx-cell" />
        <td id="Artillery → Metal" className="type-fx-cell" />
        <td id="Artillery → Electric" className="type-fx-cell" />
        <td id="Artillery → Light" className="type-fx-cell" />
        <td id="Artillery → Dark" className="type-fx-cell" />
        <td id="Artillery → Savage" className="type-fx-cell" />
        <td id="Artillery → Mystic" className="type-fx-cell" />
        <td id="Artillery → Gross" className="type-fx-cell" />
        <td id="Artillery → Spectral" className="type-fx-cell" />
        <td id="Artillery → Artillery" className="type-fx-cell" />
        <td id="Artillery → Lucid" className="type-fx-cell" />
      </tr>
      <tr id="Lucid">
        <th>
          <a className="type-icon-th type-lucid">&nbsp;</a>
        </th>
        <td id="Lucid → Normal" className="type-fx-cell" />
        <td id="Lucid → Plant" className="type-fx-cell" />
        <td id="Lucid → Water" className="type-fx-cell" />
        <td id="Lucid → Fire" className="type-fx-cell" />
        <td id="Lucid → Earth" className="type-fx-cell" />
        <td id="Lucid → Ice" className="type-fx-cell" />
        <td id="Lucid → Air" className="type-fx-cell" />
        <td id="Lucid → Metal" className="type-fx-cell" />
        <td id="Lucid → Electric" className="type-fx-cell" />
        <td id="Lucid → Light" className="type-fx-cell" />
        <td id="Lucid → Dark" className="type-fx-cell" />
        <td id="Lucid → Savage" className="type-fx-cell" />
        <td id="Lucid → Mystic" className="type-fx-cell" />
        <td id="Lucid → Gross" className="type-fx-cell" />
        <td id="Lucid → Spectral" className="type-fx-cell" />
        <td id="Lucid → Artillery" className="type-fx-cell" />
        <td id="Lucid → Lucid" className="type-fx-cell" />
      </tr>
    </tbody>
  </table></div>
    </>
  )
}

