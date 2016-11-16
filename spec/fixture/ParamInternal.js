(function(){
    'use strict';

    var Marionette = require('backbone.marionette');

    module.exports = Marionette.View.extend({
        template: require('./tpl/ParamInternal.hbs'),
        serializeData: function () {
            return {
                value: this.model ? this.model.get('value') : this.options.value
            };
        }
    });

})();
