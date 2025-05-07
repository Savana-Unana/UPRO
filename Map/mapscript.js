document.addEventListener("DOMContentLoaded", () => {
    const detailsBox = document.getElementById("shivrian-details");
    const nameBox = document.getElementById("shivrian-name");
    const imgBox = document.getElementById("shivrian-image");
    const descBox = document.getElementById("shivrian-description");
  
    const magnifier = document.createElement("div");
    magnifier.className = "magnifier";
    document.getElementById("map-container").appendChild(magnifier);
  
    let activeAlt = false;
  
    // Sample data — replace with your own
    const regionData = {
      region1: {
        name: "North Peak",
        image: "images/northpeak.png",
        description: "Snowy cliffs where rare Shivrians live."
      },
      region2: {
        name: "Lake Shivra",
        image: "images/lakeshivra.png",
        description: "Deep waters hiding ancient creatures."
      },
      region3: {
        name: "Volcanic Crater",
        image: "images/volcano.png",
        description: "Hot zone, known for fire-type Shivrians."
      }
    };
  
    // Handle region clicks
    document.querySelectorAll("svg [id]").forEach(region => {
      region.addEventListener("click", () => {
        const id = region.id;
        if (regionData[id]) {
          nameBox.textContent = regionData[id].name;
          imgBox.src = regionData[id].image;
          descBox.textContent = regionData[id].description;
          detailsBox.style.display = "block";
        }
      });
    });
  
    // Close details popup
    window.closeDetails = function () {
      detailsBox.style.display = "none";
    };
  
    // Optional: ALT mode toggle
    window.setAltTrue = function () {
      activeAlt = !activeAlt;
      alert("Alt mode is now " + (activeAlt ? "ON" : "OFF"));
    };
  
    // Search by name or ID
    window.filterShivrian = function () {
      const input = document.getElementById("search").value.toLowerCase();
      document.querySelectorAll("svg [id]").forEach(region => {
        const data = regionData[region.id];
        if (data && (data.name.toLowerCase().includes(input) || region.id.includes(input))) {
          region.style.opacity = 1;
        } else {
          region.style.opacity = 0.2;
        }
      });
    };
  
    // Magnifier logic
    const mapImg = document.getElementById("map");
    mapImg.addEventListener("mousemove", e => {
      const rect = mapImg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      const zoom = 2;
      magnifier.style.left = `${x - 75}px`;
      magnifier.style.top = `${y - 75}px`;
      magnifier.style.backgroundImage = `url(${mapImg.src})`;
      magnifier.style.backgroundRepeat = "no-repeat";
      magnifier.style.backgroundSize = `${mapImg.width * zoom}px ${mapImg.height * zoom}px`;
      magnifier.style.backgroundPosition = `-${x * zoom - 75}px -${y * zoom - 75}px`;
      magnifier.style.display = "block";
    });
  
    mapImg.addEventListener("mouseleave", () => {
      magnifier.style.display = "none";
    });
  });
  