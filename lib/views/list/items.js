var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    ItemsCollection = require('lib/models/items').Items

var ItemsView = Backbone.View.extend({
    events: {
        "click a.itemLink": "itemClick"
    },

    initialize: function() {
        _.bindAll(this, 'render', 'itemClick');

        this.points = ItemsCollection;
        
        this.points.on('sync', this.render);
        
        this.render();
    },

    render: function() {
        var elements = [];
        _(this.points.models).each(function(point) {
            var timeStr = point.get('value').created_at,
                desc = point.get('value').description,
                date = new Date(Date.parse(timeStr));
                
            var dateStr = date.toDateString() + ' - ' + date.toLocaleTimeString();
            elements.push('<dt><a href="' + point.get('id') + '" class="itemLink">'+ desc.substr(0, 100) +'... ceo tekst &raquo;</a></dt>');
            elements.push('<dd>' + dateStr + '</dd>');
        });
        
        this.$el.html(elements.join(''));
    },

    itemClick: function(e) {
        e.preventDefault();
        
        var modelId = $(e.target).attr('href');
        
        this.trigger('point', modelId);

        DISQUS.reset({
            reload: true,
            config: function () {  
                this.page.identifier = modelId;
                this.page.title = "travel blog: " + modelId;
                this.page.url = "http://dexy.cloudant.com/location/_design/location-app/index.html#!" + modelId;
            }
        });


    }
});


exports.ItemsView = ItemsView;