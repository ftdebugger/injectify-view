(function () {
    'use strict';

    var Marionette = require('backbone.marionette');

    module.exports = Marionette.View.extend({
        template: require('./tpl/LoopLayout.hbs'),

        serializeData: function () {
            return {
                values: [1, 2]
            };
        }
    });

})();
