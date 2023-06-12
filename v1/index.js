//Initialise express
const express = require("express");
const app = express();

//Have express listen on port 3000 for connections
const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//Have express serve static files such as images, CSS files, and JavaScript files
app.use(express.static("public"));


//GCP API Key: AIzaSyBfRbEPrKSs6cniENiokCq4ZUqp39eRLEw
