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
let data = [];

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

// SET CONTROLS

let radius = 4000;
const radiusInput = document.getElementById("radius-input");
radiusInput.addEventListener("input", function () {
  const radiusValue = radiusInput.value;
  radius = radiusValue;
});

let submissionDate = new Date();
let defaultDate = new Date(submissionDate.setMonth(submissionDate.getMonth() - 3));
let minDate = new Date(submissionDate);
minDate.setMonth(minDate.getMonth() - 12);
let maxDate = new Date();

const defaultDateFormattedValue = defaultDate.toISOString().split("T")[0];
const minDateFormattedValue = minDate.toISOString().split("T")[0];
const maxDateFormattedValue = maxDate.toISOString().split("T")[0];

const submissionDateBtn = document.getElementById("submission-date");
submissionDateBtn.setAttribute("value", defaultDateFormattedValue);
submissionDateBtn.setAttribute("min", minDateFormattedValue);
submissionDateBtn.setAttribute("max", maxDateFormattedValue);

submissionDateBtn.addEventListener("input", function () {
  const dateValue = submissionDateBtn.value;
  submissionDate = dateValue;
  console.log(submissionDate);
});


//LOAD THE MAP

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

async function fetchPlanningData(startingPos) {
  const url = `/planning-data?lat=${startingPos.lat}&lng=${startingPos.lng}&radius=${radius}&submissionDate=${submissionDate}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    addOverlay(data);
    showOverlay();
    addMarkers(null, data);

    btn.addEventListener("click", () => {
      console.log("button clicked");
      if (markersVisible) {
        hideMarkers();
        addOverlay(data);
        showOverlay();
        markersVisible = false;
      } else {
        deleteOverlay();
        showMarkers();
        markersVisible = true;
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function addMarkers(map, data) {
  data.forEach((element) => {
    const { coordinates } = element.geometry;
    const { address, description } = element.properties;

    const marker = new google.maps.Marker({
      position: { lat: coordinates[1], lng: coordinates[0] },
      map,
      title: `${address}: ${description}`,
    });

    markers.push(marker);
  });
}

function showMarkers() {
  setMapOnAll(map);
  map.setMapTypeId("satellite");
}

function hideMarkers() {
  setMapOnAll(null);
}

function setMapOnAll(map) {
  markers.forEach((marker) => marker.setMap(map));
}

function addOverlay(sourceData) {
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
}

function deleteOverlay() {
  overlay.finalize();
}

function showOverlay() {
  overlay.setMap(map);
  map.setMapTypeId("roadmap");
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
