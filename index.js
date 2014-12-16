(function () {
    //noinspection BadExpressionStatementJS
    "use strict";

    var Handlebars = require("injectify/runtime"),
        regionHelper = require("regions-extras"),
        Marionette = require("./marionette").getInstance();

    require("regions-extras/handlebars").setInstance(Handlebars);

    var getView = function (context) {
        if (context) {
            while (context && !context.view && context.__parent__) {
                context = context.__parent__;
            }

            return context ? context.view : null;
        }
    };

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
            view = getView(this);
            if (!view && options.data && options.data._parent) {
                view = getView(options.data._parent.root)
            }
        }

        if (options.fn) {
            hash.content = function (opts) {
                opts = _.clone(opts);
                delete opts.content;
                return new Handlebars.SafeString(options.fn(opts));
            };
        }

        if (view) {
            var onRender = function () {
                if (!view[name]) {
                    console.error('Region is not initialized, may be view is destroyed');
                }
                else {
                    view[name].show(new View(hash));
                }
            };

            var onDestroy = function () {
                view.off('render', onRender);
            };

            view.once('render', onRender);
            view.once('destroy', onDestroy);
        }
        else {
            console.warn("Cannot find 'view' for handlebars view helper '" + name + "'");
        }

        var regionHash = _.clone(hash);
        regionHash.view = view;

        return regionHelper.call(this, name, {
            hash: regionHash
        });
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
