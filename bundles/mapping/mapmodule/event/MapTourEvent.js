/**
 * @class Oskari.mapframework.event.common.AfterMapTourEvent
 *
 * Notifies application bundles that a map has moved.
 * See Oskari.mapframework.request.common.MapMoveRequest
 */
Oskari.clazz.define('Oskari.mapframework.event.common.MapTourEvent',

    /**
     * @static @method create called automatically on construction
     */
    function (status, location) {
        this._status = status;
        this._location = location;
    }, {
        /** @static @property __name event name */
        __name: 'MapTourEvent',

        /**
         * @method getName
         * @return {String} event name
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method getStatus
         * @return {Object} event status
         */
        getStatus: function () {
            return this._status;
        },

        /**
         * @method getLocation
         * @return {Object} current x and y
         */
        getLocation: function () {
            return this._location;
        },

        getParams: function () {
            return {
                status: this.getStatus(),
                location: this.getLocation()
            };
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
