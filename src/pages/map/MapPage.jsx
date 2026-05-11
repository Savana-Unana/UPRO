import { useEffect } from 'react'

const pageStyles = "body {\r\n  font-size: 1rem;\r\n  line-height: 1.5rem;\r\n  margin: 0;\r\n  padding: 0;\r\n  font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,\r\n               Bitstream Vera Sans Mono, Courier New, monospace, serif;\r\n  word-wrap: break-word;\r\n  text-align: center;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n}\r\n\r\n#map-container {\r\n  position: relative;\r\n  margin: 20px auto;\r\n  width: 460px;\r\n  max-width: 100%;\r\n  height: auto;\r\n}\r\n\r\n@media screen and (min-height: 900px) {\r\n  #map-container {\r\n    width: 540px;\r\n  }\r\n}\r\n\r\n@media screen and (max-width: 520px) {\r\n  #map-container {\r\n    width: 100%;\r\n  }\r\n}\r\n\r\n#map {\r\n  width: 105%;\r\n  height: auto;\r\n  cursor: crosshair;\r\n}\r\n\r\n#location-details {\r\n  display: none;\r\n  position: fixed;\r\n  top: 60px;\r\n  right: 20px;\r\n  width: 250px;\r\n  background: white;\r\n  border: 1px solid #ccc;\r\n  padding: 10px;\r\n  z-index: 10;\r\n  text-align: left;\r\n}\r\n#location-details img {\r\n  max-width: 100%;\r\n  height: auto;\r\n  display: block;\r\n  margin-bottom: 10px;\r\n}\r\n\r\n.search-alt-container {\r\n  display: flex;\r\n  gap: 15px;\r\n  align-items: center;\r\n  margin: 20px 0;\r\n}\r\n\r\ninput#search {\r\n  padding: 12px;\r\n  width: 300px;\r\n  border: 1px solid #ccc;\r\n  border-radius: 8px;\r\n  box-shadow: 0 2px 6px rgba(0,0,0,0.1);\r\n  transition: all 0.3s ease;\r\n}\r\ninput#search:focus {\r\n  border-color: #4824f8;\r\n  box-shadow: 0 0 8px rgba(46,46,46,0.6);\r\n  outline: none;\r\n}\r\n\r\nbutton.Alt {\r\n  background: #333;\r\n  color: #fff;\r\n  text-transform: uppercase;\r\n  font-size: 1.2em;\r\n  letter-spacing: 0.1em;\r\n  padding: 12px 30px;\r\n  border: 3px solid #00a2ff;\r\n  border-radius: 8px;\r\n  cursor: pointer;\r\n  position: relative;\r\n  overflow: hidden;\r\n  transition: 0.5s;\r\n}\r\nbutton.Alt:hover {\r\n  letter-spacing: 0.2em;\r\n  background: #555;\r\n  border-color: #00ba32;\r\n}\r\n\r\n#nav-buttons {\r\n  margin: 20px 0;\r\n  display: flex;\r\n  gap: 12px;\r\n  flex-wrap: wrap;\r\n}\r\n#nav-buttons button {\r\n  font-size: 18px;\r\n  padding: 12px 24px;\r\n  background: linear-gradient(135deg, #74ebd5, #acb6e5);\r\n  color: #333;\r\n  border: none;\r\n  border-radius: 10px;\r\n  cursor: pointer;\r\n  box-shadow: 0 3px 8px rgba(0,0,0,0.15);\r\n  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;\r\n}\r\n#nav-buttons button:hover {\r\n  background: linear-gradient(135deg, #4fd1c5, #8e9de5);\r\n  transform: translateY(-2px) scale(1.03);\r\n  box-shadow: 0 5px 12px rgba(0,0,0,0.2);\r\n}\r\n#nav-buttons button:active {\r\n  transform: translateY(0) scale(0.97);\r\n  box-shadow: 0 2px 6px rgba(0,0,0,0.15);\r\n}\r\n"
const pageScript = "document.addEventListener(\"DOMContentLoaded\", () => {\r\n  const detailsBox = document.getElementById(\"location-details\");\r\n  const nameBox = document.getElementById(\"location-name\");\r\n  const imgBox = document.getElementById(\"location-image\");\r\n  const descBox = document.getElementById(\"location-description\");\r\n\r\n  const magnifier = document.createElement(\"div\");\r\n  magnifier.className = \"magnifier\";\r\n  document.getElementById(\"map-container\").appendChild(magnifier);\r\n\r\n  let activeAlt = false;\r\n\r\n  const regionData = {\r\n      region1: {\r\n          name: \"Home\",\r\n          image: \"assets/images/mates/lost/MissingNo.png\",\r\n          description: \"Where Skip and his family live.\",\r\n          link: \"/\"\r\n      },\r\n      region2: {\r\n          name: \"Homegrounds\",\r\n          image: \"assets/images/mates/lost/MissingNo.png\",\r\n          description: \"Ariel Salama is here.\",\r\n          link: \"/\"\r\n      },\r\n      region3: {\r\n          name: \"Lake Wyonaut\",\r\n          image: \"assets/images/mates/lost/MissingNo.png\",\r\n          description: \"Deep waters. Great for fishing!\",\r\n          link: \"/\"\r\n      }\r\n  };\r\n\r\n  let currentRegionLink = null;\r\n\r\n  document.querySelectorAll(\"svg [id]\").forEach(region => {\r\n      region.addEventListener(\"click\", () => {\r\n          const id = region.id;\r\n          if (regionData[id]) {\r\n              nameBox.textContent = regionData[id].name;\r\n              imgBox.src = regionData[id].image;\r\n              descBox.textContent = regionData[id].description;\r\n              currentRegionLink = regionData[id].link;\r\n              detailsBox.style.display = \"block\";\r\n          }\r\n      });\r\n  });\r\n\r\n  imgBox.addEventListener(\"click\", () => {\r\n      if (currentRegionLink) {\r\n          window.location.href = currentRegionLink;\r\n      }\r\n  });\r\n\r\n  window.closeDetails = function () {\r\n      detailsBox.style.display = \"none\";\r\n  };\r\n\r\n  window.filterLocation = function () {\r\n      const input = document.getElementById(\"search\").value.toLowerCase();\r\n      document.querySelectorAll(\"svg [id]\").forEach(region => {\r\n          const data = regionData[region.id];\r\n          if (data && (data.name.toLowerCase().includes(input) || region.id.includes(input))) {\r\n              region.style.opacity = 1;\r\n          } else {\r\n              region.style.opacity = 0.2;\r\n          }\r\n      });\r\n  };\r\n\r\n  const mapImg = document.getElementById(\"map\");\r\n  mapImg.addEventListener(\"mousemove\", e => {\r\n      const rect = mapImg.getBoundingClientRect();\r\n      const x = e.clientX - rect.left;\r\n      const y = e.clientY - rect.top;\r\n\r\n      const zoom = 2;\r\n      magnifier.style.left = `${x - 75}px`;\r\n      magnifier.style.top = `${y - 75}px`;\r\n      magnifier.style.backgroundImage = `url(${mapImg.src})`;\r\n      magnifier.style.backgroundRepeat = \"no-repeat\";\r\n      magnifier.style.backgroundSize = `${mapImg.width * zoom}px ${mapImg.height * zoom}px`;\r\n      magnifier.style.backgroundPosition = `-${x * zoom - 75}px -${y * zoom - 75}px`;\r\n      magnifier.style.display = \"block\";\r\n  });\r\n\r\n  mapImg.addEventListener(\"mouseleave\", () => {\r\n      magnifier.style.display = \"none\";\r\n  });\r\n});\r\n"
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

export default function MapPage() {
  useEffect(() => {
    document.title = "Shiverica Map"
    document.body.className = ""
    document.body.setAttribute('style', "")

    let cancelled = false

    async function startPage() {
      for (const src of remoteScripts) {
        await loadRemoteScript(src)
      }

      if (cancelled || !pageScript) return

      window.onload = null
      new Function(`${pageScript}\n//# sourceURL=MapPage.legacy.js`)()
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
      <div className="upro-page-root"><h1>Shiverica Map</h1>
  <input type="text" id="search" placeholder="Type Location (Under-Construction)" data-oninput="filterMap()" />
  <div id="map-container">
    <svg id="map" viewBox="0 0 500 500">
      <rect id="region1" x={0} y={400} width={25} height={25} fill="brown" />
      <rect id="region2" x={0} y={425} width={25} height={25} fill="green" />
      <rect id="region3" x={25} y={400} width={25} height={25} fill="blue" />
    </svg>
  </div>
  <div id="location-details" className="hidden">
    <h2 id="location-name" />
    <img id="location-image" src alt="Location Image" />
    <p id="location-description" />
    <button data-onclick="closeDetails()">Back</button>
  </div>
  <div id="nav-buttons">
    <a href="/">
      <button>Return</button>
    </a>
  </div></div>
    </>
  )
}
