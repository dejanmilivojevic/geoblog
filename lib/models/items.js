var Backbone = require('backbone'),
    Item = require('lib/models/item').Item

var Items = Backbone.Collection.extend({
    model: Item,
    url: '/location/_design/location-app/_view/items',
    parse: function(response) {
        return response.rows;
    }
});

var items = new Items();
items.fetch({data: {'descending': 'true'}});

exports.Items = items;