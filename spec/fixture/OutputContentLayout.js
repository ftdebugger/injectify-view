(function () {
    'use strict';

    var Marionette = require('backbone.marionette');

    module.exports = Marionette.View.extend({
        template: require('./tpl/OutputContentLayout.hbs'),

        serializeData: function () {
            return {
                testVar: 123
            };
        }
    });

})();
