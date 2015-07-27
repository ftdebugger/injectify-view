(function () {
    'use strict';

    var Marionette = require('backbone.marionette');

    module.exports = Marionette.LayoutView.extend({
        template: require('./tpl/BlockLayout.hbs')
    });

})();
