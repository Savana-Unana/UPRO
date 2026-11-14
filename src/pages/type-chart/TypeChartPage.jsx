import { useEffect } from 'react'

/* eslint-disable no-unused-vars, no-redeclare */
const pageStyles = "html {\r\n                color: #FFFFFF;\r\n                background-color: #292929;\r\n                font-family: UPRO;\r\n                font-size: 15px;\r\n                line-height: 1.5;\r\n            }\r\n\r\n            table {\r\n                border-collapse: collapse;\r\n                border-spacing: 0;\r\n                margin: 0 auto 15px;\r\n                padding: 0;\r\n            }\r\n\r\n            .type-table th {\r\n                border: 2px solid #292929;\r\n                font-weight: normal;\r\n                padding: 0;\r\n            }\r\n\r\n            .type-table td {\r\n                border: 2px solid #292929;\r\n                padding: 0;\r\n            }\r\n\r\n            .type-table th a, .type-table td {\r\n                border-radius: 6px;\r\n            }\r\n\r\n            .cell-nano {\r\n                font-size: 19px;\r\n            }\r\n\r\n            .type-abbr {\r\n                background: #CCCCCC;\r\n                color: #292929;\r\n                display: inline-block;\r\n                font-size: 20px;\r\n                font-weight: bold;\r\n                height: 32px;\r\n                line-height: 32px;\r\n                text-align: center;\r\n                text-transform: uppercase;\r\n                width: 32px;\r\n            }\r\n\r\n            .type-icon-th {\r\n                background: #CCCCCC;\r\n                color: #292929;\r\n                float: left;\r\n                font-size: 20px;\r\n                font-weight: bold;\r\n                height: 32px;\r\n                line-height: 32px;\r\n                text-align: center;\r\n                text-transform: uppercase;\r\n                width: 54px;\r\n            }\r\n\r\n            .type-icon-th:first-child {\r\n                margin-left: 0;\r\n            }\r\n\r\n            .type-fx-cell {\r\n                color: #292929;\r\n                font-size: 24px;\r\n                font-weight: bold;\r\n                height: 32px;\r\n                line-height: 32px;\r\n                text-align: center;\r\n                width: 32px;\r\n            }\r\n\r\n            .type-fx-0 {\r\n                background-color: #4A4A4A;\r\n                color: white;\r\n            }\r\n\r\n            .type-fx-50 {\r\n                background-color: #F2665C;\r\n            }\r\n\r\n            .type-fx-75 {\r\n                background-color: #F2665C;\r\n                font-size: 28px;\r\n            }\r\n\r\n            .type-fx-100 {\r\n                background-color: #bebebe;\r\n            }\r\n\r\n            .type-fx-150 {\r\n                background-color: #B1D490;\r\n                font-size: 28px;\r\n            }\r\n\r\n            .type-fx-200 {\r\n                background-color: #B1D490;\r\n            }\r\n\r\n            .type-normal {\r\n                background: black url(\"assets/images/ui/types/Normal.png\") center no-repeat;\r\n            }\r\n\r\n            .type-plant {\r\n                background: black url(\"assets/images/ui/types/Plant.png\") center no-repeat;\r\n            }\r\n\r\n            .type-water {\r\n                background: black url(\"assets/images/ui/types/Water.png\") center no-repeat;\r\n            }\r\n\r\n            .type-fire {\r\n                background: black url(\"assets/images/ui/types/Fire.png\") center no-repeat;\r\n            }\r\n\r\n            .type-earth {\r\n                background: black url(\"assets/images/ui/types/Earth.png\") center no-repeat;\r\n            }\r\n\r\n            .type-ice {\r\n                background: black url(\"assets/images/ui/types/Ice.png\") center no-repeat;\r\n            }\r\n\r\n            .type-air {\r\n                background: black url(\"assets/images/ui/types/Air.png\") center no-repeat;\r\n            }\r\n\r\n            .type-metal {\r\n                background: black url(\"assets/images/ui/types/Metal.png\") center no-repeat;\r\n            }\r\n\r\n            .type-electric {\r\n                background: black url(\"assets/images/ui/types/Electric.png\") center no-repeat;\r\n            }\r\n\r\n            .type-light {\r\n                background: black url(\"assets/images/ui/types/Light.png\") center no-repeat;\r\n            }\r\n\r\n            .type-dark {\r\n                background: black url(\"assets/images/ui/types/Dark.png\") center no-repeat;\r\n            }\r\n\r\n            .type-savage {\r\n                background: black url(\"assets/images/ui/types/Savage.png\") center no-repeat;\r\n            }\r\n\r\n            .type-mystic {\r\n                background: black url(\"assets/images/ui/types/Mystic.png\") center no-repeat;\r\n            }\r\n\r\n            .type-gross {\r\n                background: black url(\"assets/images/ui/types/Gross.png\") center no-repeat;\r\n            }\r\n\r\n            .type-spectral {\r\n                background: black url(\"assets/images/ui/types/Spectral.png\") center no-repeat;\r\n            }\r\n\r\n            .type-artillery {\r\n                background: black url(\"assets/images/ui/types/Artillery.png\") center no-repeat;\r\n            }\r\n\r\n            .type-lucid {\r\n                background: black url(\"assets/images/ui/types/Lucid.png\") center no-repeat;\r\n            }"
function runPageScript() {
  window.addEventListener("DOMContentLoaded", async function () {
      var fallbackTypings = [
          {"name":"Normal","strongAgainst":["Ice","Electric","Earth","Air"],"weakTo":["Gross","Savage","Mystic","Metal"]},
          {"name":"Water","strongAgainst":["Fire","Earth","Gross","Metal"],"weakTo":["Plant"]},
          {"name":"Plant","strongAgainst":["Water","Earth","Light","Spectral"],"weakTo":["Fire","Metal"]},
          {"name":"Fire","strongAgainst":["Plant","Ice","Gross","Savage","Metal"],"weakTo":["Water","Earth"]},
          {"name":"Ice","strongAgainst":["Water","Savage","Mystic","Metal"],"weakTo":["Earth","Artillery"]},
          {"name":"Electric","strongAgainst":["Water","Air","Gross","Savage","Mystic"],"weakTo":["Earth"]},
          {"name":"Earth","strongAgainst":["Fire","Electric","Light","Spectral"],"weakTo":["Water","Plant","Air","Metal"]},
          {"name":"Air","strongAgainst":["Earth","Savage","Metal","Artillery"],"weakTo":["Plant","Electric"]},
          {"name":"Light","strongAgainst":["Air","Dark","Spectral","Artillery"],"weakTo":["Water","Plant","Earth"]},
          {"name":"Dark","strongAgainst":["Plant","Air","Light","Spectral","Artillery"],"weakTo":["Fire","Electric"]},
          {"name":"Spectral","strongAgainst":["Normal","Electric","Gross","Savage","Mystic"],"weakTo":["Plant","Light","Dark"]},
          {"name":"Gross","strongAgainst":["Normal","Plant","Light","Dark","Gross","Mystic","Metal"],"weakTo":["Water","Savage"]},
          {"name":"Savage","strongAgainst":["Normal","Water","Plant","Fire","Earth","Light","Dark","Gross","Savage"],"weakTo":["Air","Spectral","Mystic","Artillery"]},
          {"name":"Mystic","strongAgainst":["Normal","Air","Light","Dark","Savage","Mystic","Artillery"],"weakTo":["Gross"]},
          {"name":"Metal","strongAgainst":["Ice","Electric","Earth","Air","Savage","Mystic","Metal","Artillery"],"weakTo":["Water","Plant","Fire"]},
          {"name":"Artillery","strongAgainst":["Normal","Plant","Ice","Air","Gross","Savage","Mystic","Artillery"],"weakTo":["Water","Earth","Spectral"]},
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

      updateStats();

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

      function updateValue(stat, value) {
          if (!stat) return;

          stat.className = value <= -0.01 ? "type-fx-cell type-fx-75" :
              value >= 0.01 ? "type-fx-cell type-fx-150" :
              "type-fx-cell type-fx-0";

          if (stat.className === "type-fx-cell type-fx-0") value = 0;

          stat.innerHTML = value.toFixed(2);
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
    document.title = '⊙'
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
      <div className="upro-page-root"><div style={{display: 'flex'}}>
    <div id="nav-btn">
      <a href="/">
        <button>Main Menu</button>
      </a>
    </div>
  </div>
  <h1 style={{marginTop: 0, marginBottom: 5}}>TypeChart</h1>
  <table className="type-table">
    <thead><tr id="typechart-head" /></thead>
    <tbody id="typechart-body" />
  </table></div>
    </>
  )
}

