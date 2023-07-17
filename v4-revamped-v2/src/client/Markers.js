class Markers {
  constructor(map) {
    this.map = map;
    this.markers = [];
  }

  addMarker(element) {
    const { coordinates } = element.geometry;
    const { address, description } = element.properties;

    const marker = new google.maps.Marker({
      position: { lat: coordinates[1], lng: coordinates[0] },
      map: this.map,
      title: `${address}: ${description}`,
    });

    this.markers.push(marker);
  }

  showMarkers() {
    this.setMapOnAll(this.map);
    this.map.setMapTypeId("satellite");
  }

  hideMarkers() {
    this.setMapOnAll(null);
  }

  setMapOnAll(map) {
    this.markers.forEach((marker) => marker.setMap(map));
  }
}
