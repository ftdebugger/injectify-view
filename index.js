(function () {
    //noinspection BadExpressionStatementJS
    'use strict';

    var Handlebars = require('injectify/runtime'),
        utils = require('injectify/utils'),
        regionHelper = require('regions-extras');

    /**
     * @param {Backbone.View} View
     * @param {String} [name]
     * @param {Object} [hash]
     * @param {Object} options
     * @returns {*}
     */
    var viewHelper = function () {
        var args = utils.extractArguments(this, _.toArray(arguments)),
            options = args.options,
            View = args.module,
            hash = args.hash,
            parentView = args.parentView,
            name = args.name;

        if (options.fn) {
            hash.content = function (opts) {
                opts = _.clone(opts);
                delete opts.content;
                return new Handlebars.SafeString(options.fn(opts));
            };
        }

        if (parentView) {
            var onRender = function () {
                if (!parentView[name]) {
                    console.error('Region is not initialized, may be view is destroyed');
                }
                else {
                    parentView[name].show(new View(hash));
                }
            };

            var onDestroy = function () {
                parentView.off('render', onRender);
            };

            parentView.once('render', onRender);
            parentView.once('destroy', onDestroy);
        } else {
            console.warn('Cannot find "view" for handlebars view helper "' + name + '"');
        }

        var regionHash = _.clone(hash);
        regionHash.view = parentView;

        return regionHelper.call(this, name, {
            hash: regionHash
        });
    };

    /**
     * Allow use {{content}} helper to render views content from external view, passed as param
     *
     * @param options
     * @returns {*}
     */
    var contentHelper = function (options) {
        var view = utils.extractView(this, options.hash, options);

        if (view) {
            return view.options.content.call(view, options.data.root);
        } else {
            console.warn('Cannot find "view" for handlebars content helper');
        }
    };

    Handlebars.registerHelper('view', viewHelper);
    Handlebars.registerHelper('content', contentHelper);

    module.exports = viewHelper;
})();
