(function(){
    //noinspection BadExpressionStatementJS
    "use strict";

    var Marionette = require("../../marionette").getInstance();

    module.exports = Marionette.ItemView.extend({
        template: require("./tpl/ParamInternal.hbs")
    });

})();
