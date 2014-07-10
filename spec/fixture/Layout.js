(function(){
    //noinspection BadExpressionStatementJS
    "use strict";

    var Marionette = require("../../marionette").getInstance();

    module.exports = Marionette.Layout.extend({
        template: require("./tpl/Layout.hbs")
    });

})();
