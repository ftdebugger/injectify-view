(function(){
    'use strict';

    var Marionette = require('backbone.marionette');

    module.exports = Marionette.View.extend({
        template: require('./tpl/ParamLayout.hbs')
    });

})();
