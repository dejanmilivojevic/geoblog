var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery'),
    Item = require('lib/models/item').Item;

var Items = Backbone.Collection.extend({
    model: Item,
    url: '/location/_design/location-app/_view/items',

    parse: function(response) {

        // var bgimages = [];

        // _.each(response.rows, function (row) {
        //     _.each(row.value._attachments, function (att, i) {
        //         if (att.content_type === "image/jpeg") {
        //             bgimages.push({
        //                 id: row.id,
        //                 name: i
        //             });
        //         }
        //     });
        // });

        // var randInt = (Math.floor(Math.random() * (bgimages.length)));
        // var img = bgimages[randInt];
        // var imgPath = '/location/' + img.id + '/' + img.name;

        // $('.fullscreen_post_bg').css({'background-image': 'url(' + imgPath + ')'});

        return response.rows;
    }
});

var items = new Items();
items.fetch({data: {'descending': 'true'}});

exports.Items = items;