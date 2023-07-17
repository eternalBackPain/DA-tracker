import { GoogleMapsOverlay as DeckOverlay } from "@deck.gl/google-maps";
import { HexagonLayer } from "@deck.gl/aggregation-layers";

class Overlay {
  constructor(sourceData, map) {
    this.map = map;
    this.sourceData = sourceData;
    this.overlay = null;
  }

  addOverlay() {
    this.overlay = new DeckOverlay({
      layers: [
        new HexagonLayer({
          id: "hexagons",
          data: this.sourceData,
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

    this.showOverlay();
  }

  deleteOverlay() {
    if (this.overlay) {
      this.overlay.finalize();
      this.overlay = null;
    }
  }

  showOverlay() {
    this.overlay.setMap(this.map);
    this.map.setMapTypeId("roadmap");
  }
}
