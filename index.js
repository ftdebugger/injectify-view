(function () {
    //noinspection BadExpressionStatementJS
    "use strict";

    var Handlebars = require("injectify/runtime"),
        regionHelper = require("regions-extras"),
        Marionette = require("./marionette").getInstance();

    require("regions-extras/handlebars").setInstance(Handlebars);

    /**
     * @param {Backbone.View} View
     * @param {String} [name]
     * @param {Object} [hash]
     * @param {Object} options
     * @returns {*}
     */
    var viewHelper = function () {
        var args = _.toArray(arguments),
            options = args.pop(),
            View = args.shift(),
            name, hash, view;

        if (args.length && typeof args[0] == "string") {
            name = args.shift();
        }

        if (args.length && typeof args[0] == "object") {
            hash = args.pop();
        }

        if (hash) {
            hash = _.extend({}, hash, options.hash);
        }
        else {
            hash = options.hash;
        }

        if (!name) {
            name = _.uniqueId('view');
        }

        if (hash.view) {
            view = hash.view;
        }
        else {
            var context = this;

            while (context && !context.view && context.__parent__) {
                context = context.__parent__;
            }

            view = context ? context.view : null;
        }

        if (options.fn) {
            hash.content = function (opts) {
                return new Handlebars.SafeString(options.fn(opts));
            };
        }

        if (view) {
            view.on('render', function () {
                view[name].show(new View(hash));
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
