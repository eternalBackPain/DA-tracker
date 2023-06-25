/**
 * Google Map Smooth Zoom
 *
 * Zoom in or out smoothly on a Google Map
 */

/**
 * This class handles zooming in and out of a map smoothly.
 */
class GoogleMapSmoothZoom {
    /**
     * Constructor.
     *
     * @param map
     */
    constructor(map) {
        this.map = map
        this.resolve = false
        this.reject = false

        this._doZoom = this._doZoom.bind( this )
        this._zoomIn = this._zoomIn.bind( this )
        this._zoomOut = this._zoomOut.bind( this )
    }

    /**
     * Zoom in to a map smoothly.
     *
     * @param level
     * @returns {Promise<any>}
     */
    in( level ) {
        return new Promise( ( resolve, reject ) => {
            this.resolve = resolve
            this.reject = reject

            this._zoomIn( level, this.map.getZoom() )
        } )
    }

    /**
     * Zoom out of a map smoothly.
     *
     * @param level
     * @returns {Promise<any>}
     */
    out( level ) {
        return new Promise( ( resolve, reject ) => {
            this.resolve = resolve
            this.reject = reject

            this._zoomOut( level, this.map.getZoom() )
        } )
    }

    /**
     * The handler for zooming in to of the map.
     * Calls itself recursively until it's reached the correct amount of zoom.
     *
     * @param level
     * @param cnt
     * @private
     */
    _zoomIn( level, cnt ) {
        if ( cnt > level ) {
            if ( this.resolve ) {
                this.resolve( this )
            }

            return
        }

        var z = google.maps.event.addListener( this.map, 'zoom_changed', event => {
            google.maps.event.removeListener( z )
            this._zoomIn( level, cnt + 1 )
        } )

        this._doZoom( cnt )
    }

    /**
     * The handler for zooming out of the map.
     * Calls itself recursively until it's reached the correct amount of zoom.
     *
     * @param level
     * @param cnt
     * @private
     */
    _zoomOut( level, cnt ) {
        if ( cnt < level ) {
            if ( this.resolve ) {
                this.resolve( this )
            }

            return
        }

        var z = google.maps.event.addListener( this.map, 'zoom_changed', event => {
            google.maps.event.removeListener( z )
            this._zoomOut( level, cnt - 1 )
        } )

        this._doZoom( cnt )
    }

    /**
     * Handle the actual zooming of the Google Map.
     *
     * @param cnt
     * @private
     */
    _doZoom( cnt ) {
        setTimeout( () => {
            this.map.setZoom( cnt )
        }, 80 )
    }

}

// Export
export default GoogleMapSmoothZoom