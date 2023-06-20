# DA-tracker
Visualising planning and development applications in Australia

This app uses google maps and deck.gl to plot and visualise data in 3D. It uses Vite as a build tool and Express for a backend server that calls to the PlanningAlerts API.

PlanningAlerts is attributed to the OpenAustralia Foundation. The PlanningAlerts service is intended to help people be aware of what's happening in their local neighborhood, and to enable a civil discussion about those changes.

Essentially, the app plots development applications on a map, clusters the results by density, and displays the results as 3D pillars.

## Showcase
![image](https://github.com/eternalBackPain/DA-tracker/assets/97266283/de285583-b2dd-4a75-9ca4-dea0e664692f)

## TODO
- Add an about page and include general legal advice on how development applications work at law and what the rights of an objector are
- Add a form field to enter an address/suburb instead of relying on your own Geolocation
- Add a form field to control any other variables that might be interesting to play with (e.g. radius, date of submission)
- Filter development applications by submission date. This may include altering my loop on the fetch function to continue looping until fetch number n+1 has no development applications before a certain date (e.g. 1/3/6 months from today's date)
- Make other calls to PlanningAlerts API that might be of interest
- Add styling to everything

## App development history
- v1: Tried making an express backend that recieved POST requests from the client. The issue here was that I was trying to use the @googlemaps/js-api-loader module to load the Maps API then pass it back to the client, but obv you cant load the map in the server so idk what the heck was happening.
- v2: Tried using Next.js to handle everything to do with servers and routing. I couldn't figure how to load the google map here, and any console error I got would be gibberish to me as frameworks can sometimes get a bit too hectic for my simple app
- v3: Here I made substantial progress: first started out with simple html, js and css files to get the goddamn map on the page. This worked, so then i integrated the Geolocation API and PlanningAlerts API (despite being all on the client). To integrate deck.gl as an overlay to my google map, I had to use node.js to install dependencies. However, I could not import any objects from deck.gl because of a mismatch between commonJS and ES modules. Setting up a server in an attempt to resolve this issue was futile, however I did end up refactoring my code to have my call to PlanningAlerts API live in the server.
- v4: To resolve the ESM issue, I learnt about Vite and used it for my development tooling and bundling (the previous v4 was an attempt at using webpack to do this, but its a shitty developer experience: no instant reload; need to build and serve; and requires a separate node package for a dev server). I wanted to keep the code I wrote in the express server so I used `npm i vite-express` to start a new project and transfer in all my code. Worked well and resolved any issues I had when trying to import modules from the dependencies I installed.


