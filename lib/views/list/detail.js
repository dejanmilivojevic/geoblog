var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone')
    
    
var DetailView = Backbone.View.extend({
    
    render: function(Item) {
        var elements = [],
            value = Item.get('value'),
            id = value._id,
            desc = value.description.replace(/\n/g, '<br />')
            
        elements.push('<p>' + desc + '</p>');
        
        if (value._attachments) {
            var attachments = _.keys(value._attachments);
            var mimeType = value._attachments[attachments[0]].content_type;
            
            if (mimeType.indexOf('video') !== -1) {
                elements.push('<video controls><source src="/location/' + id + '/' + attachments[0] + '" type="' + mimeType + '"></video>');
            } else {
                elements.push('<img src="/location/' + id + '/' + attachments[0] + '"/>');
            }
            
        }
        
        this.$el.html(elements.join(''));
        
    }
});

exports.DetailView = DetailView;