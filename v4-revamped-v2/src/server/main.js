//BOILERPLATE
const express = require("express");
const ViteExpress = require("vite-express");
const app = express();
// const date = require('date-and-time');
// const fs = require('fs');
// const md = require('markdown-it')();

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);

//API KEYS
const PLANNING_ALERTS_API_KEY = "riP43cYUNoWbcCfJ1EkS";
//google maps url: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBfRbEPrKSs6cniENiokCq4ZUqp39eRLEw&callback=initMap"
//google maps MapId: 9ee2e6e794acfb79

//GET PLANNING DATA
app.get("/planning-data", async (req, res) => {
  const lat = req.query.lat;
  const lng = req.query.lng;
  const radius = req.query.radius;
  const submissionDateTarget = new Date(req.query.submissionDate);
  console.log(submissionDateTarget);
  const fetchPromises = [];
  let continueLoop = true;
  let continueLoopIndex = 1;

  while (continueLoop) {
    console.log("starting while lioop");
    const url = `https://api.planningalerts.org.au/applications.geojson?key=${PLANNING_ALERTS_API_KEY}&lat=${lat}&lng=${lng}&radius=${radius}&page=${continueLoopIndex}`;
    const response = await fetch(url);
    const data = await response.json();
    fetchPromises.push(data);
    const lastSubmissionDate = new Date(
      data.features[data.features.length - 1].properties.date_received
    );
    console.log(lastSubmissionDate);

    if (lastSubmissionDate < submissionDateTarget) {
      continueLoop = false;
      console.log("BREAK");
    } else {
      continueLoopIndex++;
      console.log(continueLoopIndex);
    }
  }

  try {
    const planningData = await Promise.all(fetchPromises);
    const combinedPlanningData = {
      type: "FeatureCollection",
      features: [],
    };

    for (const featureCollection of planningData) {
      combinedPlanningData.features.push(...featureCollection.features);
    }

    //Remove any DAs that are not within the date range
    combinedPlanningData.features = combinedPlanningData.features.filter((feature) => {
      const dateReceived = new Date(feature.properties.date_received);
      return dateReceived >= submissionDateTarget;
    })

    res.json(combinedPlanningData.features);
    
  } catch (error) {
    console.error(error);
  }
});
