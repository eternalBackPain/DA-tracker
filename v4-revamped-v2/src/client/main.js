import { GoogleMapsOverlay as DeckOverlay } from "@deck.gl/google-maps";
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers";

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
      console.log("current position:");
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
  console.log("initializing map");
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: startingPos,
    mapId: GOOGLE_MAP_ID,
  });
  console.log("map initialized");
  fetchPlanningData(startingPos);
}

// CALL THE PLANNINGALERTS API
function fetchPlanningData(startingPos) {
  console.log("fetching planning data");
  const url = `/planning-data?lat=${startingPos.lat}&lng=${startingPos.lng}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // addMarkers(map, data);
      addOverlay(data);
    })
    .catch((error) => console.error(error));
}

//ADD MARKERS
function addMarkers(map, data) {
  console.log("adding markers");
  data.forEach((element) => {
    const lng = element.geometry.coordinates[0];
    const lat = element.geometry.coordinates[1];
    const address = element.properties.address;
    const description = element.properties.description;
    const marker = new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: map,
      title: `${address}: ${description}`,
    });
  });
}

//ADD OVERLAY
function addOverlay(sourceData) {
  console.log("adding overlay");
  const overlay = new DeckOverlay({
    layers: [
      new GeoJsonLayer({
        id: "geojson",
        data: sourceData,
        pointType: 'circle',
        getFillColor: [255, 0, 0],
        getRadius: 100,
        extruded: true,
        wireframe: true,
        getElevation: 100
      }),
    ],
  });

  overlay.setMap(map);
}

// CREATE SCRIPT TAG AND CALL THE GOOGLE MAPS URL
const GOOGLE_MAP_API_KEY = "AIzaSyBfRbEPrKSs6cniENiokCq4ZUqp39eRLEw";
const script = document.createElement("script");
// script.async = true;
// script.defer = true;
script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&map_ids=${GOOGLE_MAP_ID}`;
document.head.appendChild(script);
script.addEventListener("load", function () {
  initMap(); // Call initMap once the API has finished loading
});
