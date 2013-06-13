var Backbone = require('backbone')

exports.Item = Backbone.Model.extend({
    urlRoot: '/location',
    idAttribute: "_id"
});
