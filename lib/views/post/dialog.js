var Backbone = require('backbone'),
    _ = require('underscore'),
    modal = require('packages/bootstrap/bootstrap/js/bootstrap-modal')
    
var DialogView = Backbone.View.extend({
    events: {
        "click #modal-form-submit": "modalConfirm"
    },
    
    initialize: function() {
        this.$el.modal();
    },
    
    modalConfirm: function(e) {
        e.preventDefault();
        if (e.target.dataset.value === 'yes') {
            this.trigger('update', true);
        }
        
        this.$el.modal('hide');
    }
});

exports.DialogView = DialogView;