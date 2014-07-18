(function () {
    //noinspection BadExpressionStatementJS
    "use strict";

    var Handlebars = require("injectify/runtime"),
        regionHelper = require("regions-extras"),
        Marionette = require("./marionette").getInstance();

    require("regions-extras/handlebars").setInstance(Handlebars);

    var viewHelper = function (View, name, options) {
        if (typeof name == "object" && name) {
            options = name;
            name = null;
        }

        if (!name) {
            name = _.uniqueId('view');
        }

        var context = this;

        while (context && !context.view && context.__parent__) {
            context = context.__parent__;
        }

        var view = context ? context.view : null;

        if (view) {
            view.on('render', function () {
                view[name].show(new View(options.hash));
            });
        }
        else {
            console.warn("Cannot find 'view' for handlebars view helper '" + name + "'");
        }

        return regionHelper.call(this, name, options);
    };

    var mixinTemplateHelpers = Marionette.View.prototype.mixinTemplateHelpers;
    Marionette.View.prototype.mixinTemplateHelpers = function (data) {
        data = mixinTemplateHelpers.call(this, data);
        data.view = this;

        return data;
    };

    Handlebars.registerHelper("view", viewHelper);

    module.exports = viewHelper;
})();
