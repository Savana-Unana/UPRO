document.addEventListener("DOMContentLoaded", () => {
    const detailsBox = document.getElementById("location-details");
    const nameBox = document.getElementById("location-name");
    const imgBox = document.getElementById("location-image");
    const descBox = document.getElementById("location-description");
  
    const magnifier = document.createElement("div");
    magnifier.className = "magnifier";
    document.getElementById("map-container").appendChild(magnifier);
  
    let activeAlt = false;
  
    const regionData = {
      region1: {
        name: "Home",
        image: "../lostimages/MissingNo.png",
        description: "Where Skip and his family live."
      },
      region2: {
        name: "Homegrounds",
        image: "../lostimages/MissingNo.png",
        description: "Deep waters hiding ancient creatures."
      },
      region3: {
        name: "Lake Shivra",
        image: "../lostimages/MissingNo.png",
        description: "Deep waters. Great for fishing!"
      }
    };
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
  
    window.closeDetails = function () {
      detailsBox.style.display = "none";
    };
  
    window.filterLocation = function () {
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
  