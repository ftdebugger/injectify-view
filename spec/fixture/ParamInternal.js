(function(){
    'use strict';

    var Marionette = require('backbone.marionette');

    module.exports = Marionette.ItemView.extend({
        template: require('./tpl/ParamInternal.hbs')
    });

})();
