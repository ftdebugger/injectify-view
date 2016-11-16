(function () {
    'use strict';

    var Marionette = require('backbone.marionette');

    module.exports = Marionette.View.extend({
        template: require('./tpl/EachLayout.hbs'),

        serializeData: function () {
            return this.options;
        }
    });

})();
