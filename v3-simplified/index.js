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
function initMap() {
  // Create new map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: startingPos,
  });

  getPlanningData();
  addMarkers(map);
}

// CALL THE PLANNINGALERTS API
let fullPlanningData = [];
function getPlanningData() {
  const fetchPromises = [];
  //Call fetch the API 10 times to get 1000 results
  for (let i = 1; i < 4; i++) {
    // Call applications by specifying a lat, lng, and radius
    const url = `https://api.planningalerts.org.au/applications.json?key=riP43cYUNoWbcCfJ1EkS&lat=${startingPos.lat}&lng=${startingPos.lng}&radius=4000&page=${i}`;

    const fetchPromise = fetch(url)
      .then((response) => response.json())
      .then((data) => {
        fullPlanningData = fullPlanningData.concat(data);
      })
      .catch((error) => console.error(error));

    fetchPromises.push(fetchPromise);
  }

  Promise.all(fetchPromises)
    .then(() => {
      // All fetch calls have completed, fullPlanningData is populated
      addMarkers(map);
    })
    .catch((error) => console.error(error));
}

//ADD MARKERS
function addMarkers(map) {
  console.log(fullPlanningData);
  fullPlanningData.forEach((element) => {
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

// CREATE SCRIPT TAG AND CALL THE GOOGLE MAPS URL
const script = document.createElement("script");
script.async = true;
script.defer = true;
script.src =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyBfRbEPrKSs6cniENiokCq4ZUqp39eRLEw&callback=initMap";
document.head.appendChild(script);
