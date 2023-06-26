import { GoogleMapsOverlay as DeckOverlay } from "@deck.gl/google-maps";
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import GoogleMapSmoothZoom from "./Zoomer";
import { displayToggle } from "./Toggle";

let map;
let markers = [];
let markersVisible = false;
let overlay;
let zoomer;
const btn = document.querySelector(".btn-holder");

//HANDLE POSITIONING

let position = {
  lat: -24.57571089140259,
  lng: 133.26174047286068,
};

function getCurrentPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // Update the lat/lng values of startingPos
        position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        updateMapPosition(position);
        updateMapZoom(13);
        fetchPlanningData(position);
      },
      function (error) {
        console.log(error.message); // Handle any errors that occur
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function updateMapPosition(newPosition) {
  map.panTo(newPosition);
}

function updateMapZoom(newZoom) {
  zoomer.in(newZoom);
}

function handlePositionChange() {
  //handle typed address
  const input = document.getElementById("address-input");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener("place_changed", function () {
    const place = autocomplete.getPlace();
    position = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    updateMapPosition(position);
    updateMapZoom(13);
    fetchPlanningData(position);
  });
  //handle geolocate button
  const geolocateButton = document.getElementById("geolocate");
  geolocateButton.addEventListener("click", getCurrentPosition);
}

// LOAD THE MAP

let radius = 4000;
const radiusInput = document.getElementById("radius-input");
radiusInput.addEventListener("input", function () {
  const radiusValue = radiusInput.value;
  radius = radiusValue;
});

const GOOGLE_MAP_ID = "9ee2e6e794acfb79";
function initMap() {
  // Create new map
  console.log("initializing map");
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: position,
    tilt: 45, // Set the tilt angle (0 for flat, 45 for 45-degree tilt, etc.)
    mapId: GOOGLE_MAP_ID,
  });
  console.log(`Map initialized`);
  console.log(position);
}

/// CALL THE PLANNINGALERTS API

function fetchPlanningData(startingPos) {
  console.log("fetching planning data");
  const url = `/planning-data?lat=${startingPos.lat}&lng=${startingPos.lng}&radius=${radius}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      addOverlay(data);
      showOverlay();
      addMarkers(null, data);
      btn.addEventListener("click", () => {
        console.log("button clicked");
        if (markersVisible) {
          hideMarkers();
          showOverlay();
          markersVisible = false;
        } else {
          hideOverlay();
          showMarkers();
          markersVisible = true;
        }
      });
    })
    .catch((error) => console.error(error));
}

// ADD AND HIDE MARKERS
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
    markers.push(marker);
  });
}

function showMarkers() {
  setMapOnAll(map);
}

function hideMarkers() {
  setMapOnAll(null);
}

function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// ADD AND REMOVE OVERLAY
function addOverlay(sourceData) {
  console.log("adding overlay");
  overlay = new DeckOverlay({
    layers: [
      new HexagonLayer({
        id: "hexagons",
        data: sourceData,
        elevationScale: 4,
        extruded: true,
        getPosition: (d) => d.geometry.coordinates,
        radius: 100,
        pickable: true,
      }),
    ],
    getTooltip: ({ object }) =>
      object && {
        html: `<h2>Number of DAs: ${object.points.length}</h2>`,
      },
  });
  console.log(overlay);
}

function hideOverlay() {
  console.log("hiding overlay");
  overlay.setMap(null);
  console.log(overlay)
}

function showOverlay() {
  console.log("showing overlay");
  overlay.setMap(map);
  console.log(overlay)
}


// CREATE SCRIPT TAG AND CALL THE GOOGLE MAPS URL
const GOOGLE_MAP_API_KEY = "AIzaSyBfRbEPrKSs6cniENiokCq4ZUqp39eRLEw";
const PLACES_API_KEY = "AIzaSyAIRkPnJrXCvBKaaTOVZNNI3fgNfJXqOME";
const script = document.createElement("script");
// script.async = true;
// script.defer = true;
script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&map_ids=${GOOGLE_MAP_ID}&libraries=places&key=${PLACES_API_KEY}`;
document.head.appendChild(script);
script.addEventListener("load", function () {
  initMap(); // Call initMap once the API has finished loading
  zoomer = new GoogleMapSmoothZoom(map);
  handlePositionChange();
  displayToggle();
});
