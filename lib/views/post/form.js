var Backbone = require('backbone'),
    _ = require('underscore'),
    Item = require('lib/models/item').Item

var FormView = Backbone.View.extend({
    image: {},
    
    events: {
        'submit form': 'handlePost'
    },
    
    initialize: function() {
        _.bindAll(this, 'clearForm', 'handlePost', 'setFields');
    },
    
    clearForm: function() {
        this.$el.find('form').find("input, textarea").val("");
    },
    
    handlePost: function(e) {
        e.preventDefault();
        
        var lat = $(e.target).find('input[name=lat]').val();
        var lon = $(e.target).find('input[name=lon]').val();
        var desc = $(e.target).find('textarea[name=description]').val();
        var dateTime = $(e.target).find('input[name=dateTime]').val();
        
        if (dateTime === '') {
            dateTime = JSON.stringify(new Date()).replace(/\"/g, '');
        }
        
        var item = new Item();
        item.set('created_at', dateTime);
        item.set('loc', {lat: lat, lon: lon});
        item.set('description', desc);
        
        if (this.image.data && this.image.data.length > 1) {
            var fileData = this.image.data.split(',')[1];
            var fileMime = this.image.data.match(/:([\w\-\_]*\/[\w\-\_]*);/)[1];
            var fileName = this.image.name;
            
            var attachment = {}
            attachment[fileName] = {
                "content_type": fileMime,
                "data": fileData
            }
            
            item.set('_attachments', attachment);
        }
        
        item.save({}, {
            success: this.clearForm
        });
    },
    
    setFields: function(lat, lon, dateTime) {
        this.$el.find('input[name=lat]').val(lat);
        this.$el.find('input[name=lon]').val(lon);
        
        if (dateTime) {
            this.$el.find('input[name=dateTime]').val(dateTime);
        }
    }
});

exports.FormView = FormView;