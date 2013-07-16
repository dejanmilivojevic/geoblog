var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    ItemsCollection = require('lib/models/items').Items;

var MapView = Backbone.View.extend({
    id: 'map',

    initialize: function() {
        _.bindAll(this, 'initMap', 'addMarker', 'updateMarkers', 'setCenter');
        this.points = ItemsCollection;
        this.points.on('sync', this.updateMarkers);

        this.initMap();
    },

    initMap: function() {
        // Initialize Basic Openlayers;
        this.map = new OpenLayers.Map("map");
        this.map.addLayer(new OpenLayers.Layer.OSM());

        this.projection = new OpenLayers.Projection("EPSG:4326");

        //Set start centrepoint and zoom    
        var lonLat = new OpenLayers.LonLat(20.466667, 44.816667).transform(
            this.projection, // transform from WGS 1984
            this.map.getProjectionObject() // to Spherical Mercator Projection
        );
        var zoom = 12;
        this.map.setCenter(lonLat, zoom);

        // path layer
        this.lineLayer = new OpenLayers.Layer.Vector("Line Layer");
        this.map.addLayer(this.lineLayer);
        this.map.addControl(new OpenLayers.Control.DrawFeature(this.lineLayer, OpenLayers.Handler.Path));

        this.vectorLayer = new OpenLayers.Layer.Vector("Overlay");
        this.map.addLayer(this.vectorLayer);

        this.updateMarkers();
    },

    addMarker: function(lat, lon) {

        var feature = new OpenLayers.Feature.Vector(
        new OpenLayers.Geometry.Point(lon, lat).transform(this.projection, this.map.getProjectionObject()), null, {
            externalGraphic: 'static/img/marker.png',
            graphicHeight: 25,
            graphicWidth: 21,
            graphicXOffset: -12,
            graphicYOffset: -25
        });

        this.vectorLayer.addFeatures(feature);

        // set center so all markers are visible
        var bounds = this.vectorLayer.getDataExtent();
        this.map.zoomToExtent(bounds);

    },

    isNumber: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },

    updateMarkers: function() {
        var that = this,
            points = [];

        _(this.points.models).each(function(point) {
            var value = point.get('value'),
                lat = value.loc.lat,
                lon = value.loc.lon

            if (that.isNumber(lat) && that.isNumber(lon)) {
                that.addMarker(lat, lon);
                points.push(
                    new OpenLayers.Geometry.Point(lon, lat).transform(that.projection, that.map.getProjectionObject())
                );
            }
        });

        this.drawPath(points);

    },

    drawPath: function(points) {
        var line = new OpenLayers.Geometry.LineString(points),
            style = {
                strokeColor: '#0099ff',
                strokeOpacity: 0.7,
                strokeWidth: 2
            },
            lineFeature = new OpenLayers.Feature.Vector(line, null, style);

        this.lineLayer.addFeatures([lineFeature]);
    },

    setCenter: function(lat, lon, zoom) {

        var lonLat = new OpenLayers.LonLat(lon, lat).transform(
        this.projection, // transform from WGS 1984
        this.map.getProjectionObject() // to Spherical Mercator Projection
        );

        this.map.setCenter(lonLat, zoom);

    }

});

exports.MapView = MapView;