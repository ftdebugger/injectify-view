(function () {
    //noinspection BadExpressionStatementJS
    "use strict";

    var Marionette = require("../../marionette").getInstance();

    module.exports = Marionette.LayoutView.extend({
        template: require("./tpl/LoopLayout.hbs"),

        serializeData: function () {
            return {
                values: [1, 2]
            };
        }
    });

})();
