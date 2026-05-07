import { useEffect } from 'react'

const pageStyles = "html {\r\n                color: #FFFFFF;\r\n                background-color: #292929;\r\n                font-family: UPRO;\r\n                font-size: 15px;\r\n                line-height: 1.5;\r\n            }\r\n\r\n            table {\r\n                border-collapse: collapse;\r\n                border-spacing: 0;\r\n                margin: 0 auto 15px;\r\n                padding: 0;\r\n            }\r\n\r\n            .type-table th {\r\n                border: 2px solid #292929;\r\n                font-weight: normal;\r\n                padding: 0;\r\n            }\r\n\r\n            .type-table td {\r\n                border: 2px solid #292929;\r\n                padding: 0;\r\n            }\r\n\r\n            .type-table th a, .type-table td {\r\n                border-radius: 6px;\r\n            }\r\n\r\n            .cell-nano {\r\n                font-size: 19px;\r\n            }\r\n\r\n            .type-abbr {\r\n                background: #CCCCCC;\r\n                color: #292929;\r\n                display: inline-block;\r\n                font-size: 20px;\r\n                font-weight: bold;\r\n                height: 32px;\r\n                line-height: 32px;\r\n                text-align: center;\r\n                text-transform: uppercase;\r\n                width: 32px;\r\n            }\r\n\r\n            .type-icon-th {\r\n                background: #CCCCCC;\r\n                color: #292929;\r\n                float: left;\r\n                font-size: 20px;\r\n                font-weight: bold;\r\n                height: 32px;\r\n                line-height: 32px;\r\n                text-align: center;\r\n                text-transform: uppercase;\r\n                width: 54px;\r\n            }\r\n\r\n            .type-icon-th:first-child {\r\n                margin-left: 0;\r\n            }\r\n\r\n            .type-fx-cell {\r\n                color: #292929;\r\n                font-size: 24px;\r\n                font-weight: bold;\r\n                height: 32px;\r\n                line-height: 32px;\r\n                text-align: center;\r\n                width: 32px;\r\n            }\r\n\r\n            .type-fx-0 {\r\n                background-color: #4A4A4A;\r\n                color: white;\r\n            }\r\n\r\n            .type-fx-50 {\r\n                background-color: #F2665C;\r\n            }\r\n\r\n            .type-fx-75 {\r\n                background-color: #F2665C;\r\n                font-size: 28px;\r\n            }\r\n\r\n            .type-fx-100 {\r\n                background-color: #bebebe;\r\n            }\r\n\r\n            .type-fx-150 {\r\n                background-color: #B1D490;\r\n                font-size: 28px;\r\n            }\r\n\r\n            .type-fx-200 {\r\n                background-color: #B1D490;\r\n            }\r\n\r\n            .type-normal {\r\n                background: black url(\"../images/ui/Normal.png\") center no-repeat;\r\n            }\r\n\r\n            .type-plant {\r\n                background: black url(\"../images/ui/Plant.png\") center no-repeat;\r\n            }\r\n\r\n            .type-water {\r\n                background: black url(\"../images/ui/Water.png\") center no-repeat;\r\n            }\r\n\r\n            .type-fire {\r\n                background: black url(\"../images/ui/Fire.png\") center no-repeat;\r\n            }\r\n\r\n            .type-earth {\r\n                background: black url(\"../images/ui/Earth.png\") center no-repeat;\r\n            }\r\n\r\n            .type-ice {\r\n                background: black url(\"../images/ui/Ice.png\") center no-repeat;\r\n            }\r\n\r\n            .type-air {\r\n                background: black url(\"../images/ui/Air.png\") center no-repeat;\r\n            }\r\n\r\n            .type-metal {\r\n                background: black url(\"../images/ui/Metal.png\") center no-repeat;\r\n            }\r\n\r\n            .type-electric {\r\n                background: black url(\"../images/ui/Electric.png\") center no-repeat;\r\n            }\r\n\r\n            .type-light {\r\n                background: black url(\"../images/ui/Light.png\") center no-repeat;\r\n            }\r\n\r\n            .type-dark {\r\n                background: black url(\"../images/ui/Dark.png\") center no-repeat;\r\n            }\r\n\r\n            .type-savage {\r\n                background: black url(\"../images/ui/Savage.png\") center no-repeat;\r\n            }\r\n\r\n            .type-mystic {\r\n                background: black url(\"../images/ui/Mystic.png\") center no-repeat;\r\n            }\r\n\r\n            .type-gross {\r\n                background: black url(\"../images/ui/Gross.png\") center no-repeat;\r\n            }\r\n\r\n            .type-spectral {\r\n                background: black url(\"../images/ui/Spectral.png\") center no-repeat;\r\n            }\r\n\r\n            .type-artillery {\r\n                background: black url(\"../images/ui/Artillery.png\") center no-repeat;\r\n            }\r\n\r\n            .type-lucid {\r\n                background: black url(\"../images/ui/Lucid.png\") center no-repeat;\r\n            }"
const pageScript = "window.addEventListener(\"DOMContentLoaded\", function () {\r\n    var typenames = [\"Normal\", \"Plant\", \"Water\", \"Fire\", \"Earth\", \"Ice\", \"Air\", \"Metal\", \"Electric\", \"Light\", \"Dark\", \"Savage\", \"Mystic\", \"Gross\", \"Spectral\", \"Artillery\", \"Lucid\"];\r\n\r\n    var typechartHead = document.getElementById(\"typechart-head\");\r\n    var typechartBody = document.getElementById(\"typechart-body\");\r\n    var typestatsHead = document.getElementById(\"typestats-head\");\r\n\r\n    var typestatsOffense = document.getElementById(\"typestats-offense\");\r\n    var typestatsDefense = document.getElementById(\"typestats-defense\");\r\n    var typestatsOverall = document.getElementById(\"typestats-overall\");\r\n\r\n    var typerows = typenames.map(getElementById);\r\n\r\n    var types = typenames.length;\r\n    var constant = types + 1;\r\n    var size = types * types;\r\n\r\n    var crumbs = new Array(size);\r\n    var index = 0;\r\n    for (var i = 0; i < types; i++) {\r\n        for (var j = 0; j < types; j++) {\r\n            var id = typenames[i] + \" → \" + typenames[j];\r\n            crumbs[index++] = document.getElementById(id);\r\n        }\r\n    }\r\n\r\n    var typestats = typenames.map(getStats);\r\n\r\n    hashUpdate();\r\n    crumbs.forEach(listen);\r\n    window.addEventListener(\"hashchange\", hashUpdate, false);\r\n\r\n    function hashUpdate() {\r\n        var data = window.location.hash || getHash();\r\n        data = concat(data.slice(1).split(\"\").map(parse));\r\n\r\n        var length = Math.sqrt(data.length);\r\n        var mod = length % 1;\r\n\r\n        if (mod !== 0) {\r\n            length -= mod;\r\n            data.pop();\r\n        }\r\n\r\n        if (length === types) {\r\n            data.forEach(updateCrumb);\r\n            updateStats();\r\n        } else if (length + 1 === types) {\r\n            var i = length * length;\r\n            while (i > 0) {\r\n                data.splice(i, 0, 2);\r\n                i -= length;\r\n            }\r\n            for (var i = 0; i < types; i++) data.push(2);\r\n            var hash = \"#\",\r\n                index = 0;\r\n            while (index < size) {\r\n                var a = data[index++];\r\n                var b = data[index++] || 0;\r\n                hash += (a << 2 | b).toString(16);\r\n            }\r\n            window.location.href = hash.toUpperCase();\r\n        } else throw new Error(\"Unexpected error\");\r\n    }\r\n\r\n    function getElementById(id) {\r\n        return document.getElementById(id);\r\n    }\r\n\r\n    function getStats(name) {\r\n        return {\r\n            offense: document.getElementById(\"Offense \" + name),\r\n            defense: document.getElementById(\"Defense \" + name),\r\n            overall: document.getElementById(\"Overall \" + name)\r\n        };\r\n    }\r\n\r\n    function parse(x) {\r\n        var y = parseInt(x, 16);\r\n        if (isNaN(y)) throw new Error(\"Invalid data\");\r\n        return [y >>> 2, y & 3];\r\n    }\r\n\r\n    function concat(xs) {\r\n        return Array.prototype.concat.apply(Array.prototype, xs);\r\n    }\r\n\r\n    function updateCrumb(value, index) {\r\n        var crumb = crumbs[index];\r\n        switch (value) {\r\n            case 0:\r\n                crumb.className = \"type-fx-cell type-fx-0\";\r\n                crumb.innerHTML = \"0x\";\r\n                break;\r\n            case 1:\r\n                crumb.className = \"type-fx-cell type-fx-50\";\r\n                crumb.innerHTML = \".5x\";\r\n                break;\r\n            case 2:\r\n                crumb.className = \"type-fx-cell type-fx-100\";\r\n                crumb.innerHTML = \"\"; // 1x is invisible\r\n                break;\r\n            case 3:\r\n                crumb.className = \"type-fx-cell type-fx-200\";\r\n                crumb.innerHTML = \"2x\";\r\n                break;\r\n        }\r\n    }\r\n\r\n    function updateStats() {\r\n        var typechart = crumbs.map(getValue);\r\n\r\n        var result = new Array(types);\r\n        var attack = new Array(types);\r\n\r\n        for (var i = 0; i < types; i++) {\r\n            var sigmaSquare = 0;\r\n            var sigmaAttack = 0;\r\n\r\n            for (var j = 0; j < types; j++) {\r\n                var offense = typechart[i * types + j];\r\n                sigmaSquare += offense * offense;\r\n                sigmaAttack += offense;\r\n            }\r\n\r\n            result[i] = sigmaAttack * (sigmaAttack + 2) - sigmaSquare;\r\n            attack[i] = sigmaAttack;\r\n        }\r\n\r\n        var average = {\r\n            offense: 0,\r\n            defense: 0,\r\n            overall: 0\r\n        };\r\n\r\n        var stats = new Array(types);\r\n\r\n        for (var i = 0; i < types; i++) {\r\n            var sigmaDefense = 0;\r\n\r\n            for (var j = 0; j < types; j++) {\r\n                var defenses = typechart[i + types * j];\r\n                sigmaDefense += defenses * (attack[j] - defenses + 1);\r\n            }\r\n\r\n            var offense = result[i];\r\n            var overall = Math.sqrt(types * offense / sigmaDefense / constant);\r\n\r\n            var offenseValue = offense / types / constant;\r\n            var defenseValue = size / sigmaDefense;\r\n            var overallValue = overall;\r\n\r\n            stats[i] = {\r\n                offense: types * offenseValue,\r\n                defense: types * defenseValue,\r\n                overall: types * overallValue\r\n            };\r\n\r\n            average.offense += offenseValue;\r\n            average.defense += defenseValue;\r\n            average.overall += overallValue;\r\n        }\r\n\r\n        for (var i = 0; i < types; i++) {\r\n            var typestat = typestats[i];\r\n\r\n            var offenseValue = Math.log(stats[i].offense / average.offense);\r\n            var defenseValue = Math.log(stats[i].defense / average.defense);\r\n            var overallValue = Math.log(stats[i].overall / average.overall);\r\n\r\n            updateValue(typestat.offense, 100 * offenseValue);\r\n            updateValue(typestat.defense, 100 * defenseValue);\r\n            updateValue(typestat.overall, 100 * overallValue);\r\n        }\r\n\r\n        window.location.hash = getHash();\r\n    }\r\n\r\n    function getHash() {\r\n        var data = \"#\",\r\n            index = 0;\r\n\r\n        while (index < size) {\r\n            var a = getIndex(crumbs[index++]);\r\n            var b = getIndex(crumbs[index++]);\r\n            data += (a << 2 | b).toString(16);\r\n        }\r\n        return data.toUpperCase();\r\n    }\r\n\r\n    function getValue(crumb) {\r\n        switch (crumb.innerHTML) {\r\n            case \"0x\":\r\n                return 0 / 1;\r\n            case \".5x\":\r\n                return 1 / 2;\r\n            case \"\": // invisible 1x\r\n                return 1 / 1;\r\n            case \"2x\":\r\n                return 2 / 1;\r\n        }\r\n    }\r\n\r\n    function getIndex(crumb) {\r\n        if (crumb) {\r\n            switch (crumb.innerHTML) {\r\n                case \"0x\":\r\n                    return 0;\r\n                case \".5x\":\r\n                    return 1;\r\n                case \"\": // invisible 1x\r\n                    return 2;\r\n                case \"2x\":\r\n                    return 3;\r\n            }\r\n        }\r\n        return 0;\r\n    }\r\n\r\n    function updateValue(stat, value) {\r\n        if (!stat) return;\r\n\r\n        stat.className = value <= -0.01 ? \"type-fx-cell type-fx-75\" :\r\n            value >= 0.01 ? \"type-fx-cell type-fx-150\" :\r\n            \"type-fx-cell type-fx-0\";\r\n\r\n        if (stat.className === \"type-fx-cell type-fx-0\") value = 0;\r\n\r\n        stat.innerHTML = value.toFixed(2);\r\n    }\r\n\r\n    function listen(crumb) {\r\n        crumb.style.cursor = \"pointer\";\r\n\r\n        crumb.addEventListener(\"mousedown\", function (event) {\r\n            event.preventDefault();\r\n\r\n            switch (crumb.innerHTML) {\r\n                case \"\":\r\n                    crumb.className = \"type-fx-cell type-fx-200\";\r\n                    crumb.innerHTML = \"2x\";\r\n                    break;\r\n                case \"2x\":\r\n                    crumb.className = \"type-fx-cell type-fx-50\";\r\n                    crumb.innerHTML = \".5x\";\r\n                    break;\r\n                case \".5x\":\r\n                    crumb.className = \"type-fx-cell type-fx-0\";\r\n                    crumb.innerHTML = \"0x\";\r\n                    break;\r\n                case \"0x\":\r\n                    crumb.className = \"type-fx-cell type-fx-100\";\r\n                    crumb.innerHTML = \"\"; // Back to invisible 1x\r\n                    break;\r\n            }\r\n            updateStats();\r\n        }, false);\r\n    }\r\n}, false);"
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

      if (cancelled || !pageScript) return

      window.onload = null
      new Function(`${pageScript}\n//# sourceURL=TypeChartPage.legacy.js`)()
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
