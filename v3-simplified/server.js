const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const GOOGLE_MAPS_API_KEY = 'AIzaSyBfRbEPrKSs6cniENiokCq4ZUqp39eRLEw';
const PLANNING_ALERTS_API_KEY = process.env.PLANNING_ALERTS_API_KEY;

//HOW DO I IMPORT DEPENDENCIES?? I SERVED THE WEBPAGE THROUGH A SERVER AND EVERYTHING TO TRY AND FIX THIS. 
// import {GoogleMapsOverlay as DeckOverlay} from '@deck.gl/google-maps';
// import {GeoJsonLayer} from '@deck.gl/layers';

// Serve static files from the "public" directory
app.use(express.static('public'));

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/planning-data', (req, res) => {
    const lat = req.query.lat;
    const lng = req.query.lng;
    const fetchPromises = [];
  
    for (let i = 1; i < 4; i++) {
      const url = `https://api.planningalerts.org.au/applications.json?key=${PLANNING_ALERTS_API_KEY}&lat=${lat}&lng=${lng}&radius=4000&page=${i}`;
  
      const fetchPromise = fetch(url)
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => console.error(error));
  
      fetchPromises.push(fetchPromise);
    }
  
    Promise.all(fetchPromises)
      .then((results) => {
        const planningData = results.flat();
        res.json(planningData);
      })
      .catch((error) => console.error(error));
  });


//google maps url: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBfRbEPrKSs6cniENiokCq4ZUqp39eRLEw&callback=initMap"
//google maps MapId: 9ee2e6e794acfb79