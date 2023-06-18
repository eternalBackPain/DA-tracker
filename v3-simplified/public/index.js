//TODO:
//- fetch the planning API as many times as needed until there are no more applications within 1/3/6 months from when they were submitted

// GET CLIENT CURRENT POSITION
let startingPos;
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // Update the lat/lng values of startingPos
      startingPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      console.log(startingPos);

      initMap(); // Call initMap after getting the starting position
    },
    function (error) {
      console.log(error.message); // Handle any errors that occur
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}

// LOAD THE MAP
let map;
const GOOGLE_MAP_ID = "9ee2e6e794acfb79";
function initMap() {
  // Create new map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: startingPos,
    mapId: GOOGLE_MAP_ID,
  });

  fetchPlanningData(startingPos);
}

// CALL THE PLANNINGALERTS API
function fetchPlanningData(startingPos) {
  const url = `/planning-data?lat=${startingPos.lat}&lng=${startingPos.lng}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      addMarkers(map, data);
    })
    .catch((error) => console.error(error));
}

//ADD MARKERS
function addMarkers(map, planningData) {
  planningData.forEach((element) => {
    const lat = element.application.lat;
    const lng = element.application.lng;
    const address = element.application.address;
    const description = element.application.description;
    const marker = new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: map,
      title: `${address}: ${description}`,
    });
  });
}

//ADD OVERLAY
function addOverlay() {
  // Create a Deck.gl overlay
  const overlay = new DeckOverlay({
    layers: [
      new GeoJsonLayer({
        id: "geojson",
        data: fullPlanningData,
        getFillColor: [255, 0, 0],
        getRadius: 100,
      }),
    ],
  });

  // Add the overlay to the map
  overlay.setMap(map);
}

// CREATE SCRIPT TAG AND CALL THE GOOGLE MAPS URL
const script = document.createElement("script");
script.async = true;
script.defer = true;
script.src =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyBfRbEPrKSs6cniENiokCq4ZUqp39eRLEw&callback=initMap";
document.head.appendChild(script);
