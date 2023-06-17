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

      // Use the updated uluru object as needed
      console.log(startingPos);
    },
    function (error) {
      console.log(error.message); // Handle any errors that occur
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}

//LOAD THE MAP
function initMap() {
  //new map
  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: startingPos,
  });

  getPlanningData();

  //new marker
  // let marker = new google.maps.Marker({ position: startingPos, map: map });
}

//CALL THE PLANNINGALERTS API
function getPlanningData() {
  fetch(
    `https://api.planningalerts.org.au/applications.json?key=riP43cYUNoWbcCfJ1EkS&lat=${startingPos.lat}&lng=${startingPos.lng}&radius=4000`
  )
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
}

//CREATE SCRIPT TAG AND CALL THE GOOGLE MAPS URL
const script = document.createElement("script");
script.async = true;
script.defer = true;
script.src =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyBfRbEPrKSs6cniENiokCq4ZUqp39eRLEw&callback=initMap";
document.head.appendChild(script);
