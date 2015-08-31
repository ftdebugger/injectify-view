(function () {
    'use strict';

    var Marionette = require('backbone.marionette');

    module.exports = Marionette.LayoutView.extend({
        template: require('./tpl/EachLayout.hbs'),

        serializeData: function () {
            return this.options;
        }
    });

})();
