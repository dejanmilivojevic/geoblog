var Backbone = require('backbone'),
    _ = require('underscore'),
    MapView = require('lib/views/list/map').MapView,
    ItemsView = require('lib/views/list/items').ItemsView,
    ItemsCollection = require('lib/models/items').Items,
    DetailView = require('lib/views/list/detail').DetailView

var MainApp = Backbone.View.extend({
    initialize: function () {
        _.bindAll(this, 'updateViews');
        
        this.map = new MapView();
        this.items = new ItemsView({el: $('#items')});
        this.details = new DetailView({el: $('#info')});
        
        this.items.bind('point', this.updateViews);
        
    },
    
    updateViews: function(modelId) {
        var Item = ItemsCollection.find(function(val){
            return modelId === val.get('id');
        });
        
        var value = Item.get('value')
        var lat = value.loc.lat
        var lon = value.loc.lon
        var zoom = 14;
        
        this.map.setCenter(lat, lon, zoom);
        
        this.details.render(Item);
    }
});

var app = new MainApp();