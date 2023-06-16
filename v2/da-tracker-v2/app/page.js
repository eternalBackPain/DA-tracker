import React from "react";
import styles from "./globals.css"
import Map from "./components/Map";

//every folder is a component, and pages are also components. Components that are not a page (e.g. the header) are in the components folder. By default, these components are rendered on the server and not the client unless specified. You can do this by specifying 'use client' at the top of the component.

const HomePage = () => {
  return (
    <div>
      <h1>Planning and Development Application Spacial Tracker</h1>
      <Map />
    </div>
  );
};

export default HomePage;
