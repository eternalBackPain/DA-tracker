# DA-tracker
Visualising planning and development applications in Australia using PlanningAlerts API and deck.gl

The use of the PlanningAlerts API is attributed to the OpenAustralia Foundation.

NOTES:
- idk how to nto expose my API key to the client and properly request the map from Maps API
- https://developers.google.com/maps/documentation/javascript/adding-a-google-map#maps_add_map-javascript
- main thing i was trying to do was make post request from the client (using fetch) for the map. The server would then use the @googlemaps/js-api-loader module to load the Maps API then pass it back to the client, but obv you cant load the map in the server so idk what the heck was happening
- wanted to avoid using frameworks cause i dont understand how they work, but i might just use Next.js next time i want to try again (already used create-next-app@latest in the v2 folder)