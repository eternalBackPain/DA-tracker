import { GoogleMapsOverlay as DeckOverlay } from "@deck.gl/google-maps";
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers";
import { HexagonLayer } from "@deck.gl/aggregation-layers";

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
    zoom: 13,
    center: startingPos,
    tilt: 45, // Set the tilt angle (0 for flat, 45 for 45-degree tilt, etc.)
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
      //ADD ELEMENTS ONTO THE MAP
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
      new HexagonLayer({
        id: "hexagons",
        data: sourceData,
        /* props from HexagonLayer class */

        // colorAggregation: 'SUM',
        // colorDomain: null,
        // colorRange: [[255, 255, 178], [254, 217, 118], [254, 178, 76], [253, 141, 60], [240, 59, 32], [189, 0, 38]],
        // colorScaleType: 'quantize',
        // coverage: 1,
        // elevationAggregation: 'SUM',
        // elevationDomain: null,
        // elevationLowerPercentile: 0,
        // elevationRange: [0, 1000],
        elevationScale: 4,
        // elevationScaleType: 'linear',
        // elevationUpperPercentile: 100,
        extruded: true,
        // getColorValue: null,
        // getColorWeight: 1,
        // getElevationValue: null,
        // getElevationWeight: 1,
        getPosition: (d) => d.geometry.coordinates,
        // hexagonAggregator: null,
        // lowerPercentile: 0,
        // material: true,
        // onSetColorDomain: null,
        // onSetElevationDomain: null,
        radius: 100,
        // upperPercentile: 100,

        /* props inherited from Layer class */

        // autoHighlight: false,
        // coordinateOrigin: [0, 0, 0],
        // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        // highlightColor: [0, 0, 128, 128],
        // modelMatrix: null,
        // opacity: 1,
        pickable: true,
        // visible: true,
        // wrapLongitude: false,
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
