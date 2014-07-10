(function () {
    //noinspection BadExpressionStatementJS
    "use strict";

    var Handlebars = require("injectify/runtime"),
        regionHelper = require("regions-extras"),
        Marionette = require("./marionette").getInstance();


    Handlebars.registerHelper("view", function (View, name, options) {
        if (typeof name == "object") {
            options = name;
            name = _.uniqueId('view');
        }

        var view = this.view;

        if (view) {
            view.on('render', function () {
                view[name].show(new View(options.hash));
            });
        }
        else {
            console.warn("Cannot find 'view' for handlebars view helper '" + name + "'");
        }

        return regionHelper.call(this, name, options);
    });

    var mixinTemplateHelpers = Marionette.View.prototype.mixinTemplateHelpers;
    Marionette.View.prototype.mixinTemplateHelpers = function (data) {
        data = mixinTemplateHelpers.call(this, data);
        data.view = this;

        return data;
    };

})();
