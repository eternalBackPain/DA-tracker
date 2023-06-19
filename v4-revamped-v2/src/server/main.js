//BOILERPLATE
const express = require("express");
const ViteExpress = require("vite-express");

const app = express();

app.get("/hello", (req, res) => {
  res.send("Hello Vite!");
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);

//API KEYS
const PLANNING_ALERTS_API_KEY = "riP43cYUNoWbcCfJ1EkS";
//google maps url: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBfRbEPrKSs6cniENiokCq4ZUqp39eRLEw&callback=initMap"
//google maps MapId: 9ee2e6e794acfb79

//GET PLANNING DATA
app.get("/planning-data", (req, res) => {
  const lat = req.query.lat;
  const lng = req.query.lng;
  const fetchPromises = [];

  for (let i = 1; i < 11; i++) {
    const url = `https://api.planningalerts.org.au/applications.geojson?key=${PLANNING_ALERTS_API_KEY}&lat=${lat}&lng=${lng}&radius=4000&page=${i}`;

    const fetchPromise = fetch(url)
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => console.error(error));

    fetchPromises.push(fetchPromise);
  }

  Promise.all(fetchPromises)
    .then(console.log(fetchPromises))
    .then((results) => {
      const planningData = results.flat();
      const combinedPlanningData = {
        type: "FeatureCollection",
        features: [],
      };
      // Iterate through each feature collection
      for (const featureCollection of planningData) {
        combinedPlanningData.features.push(...featureCollection.features);
      }
      console.log(combinedPlanningData.features);
      res.json(combinedPlanningData.features);
    })
    .catch((error) => console.error(error));
});
