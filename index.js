'use strict';

var Handlebars = require('injectify/runtime'),
    utils = require('injectify/utils'),
    regionHelper = require('regions-extras'),
    escape = Handlebars.Utils.escapeExpression;

/**
 * @param {{}} ctx
 * @param {function|*} value
 *
 * @returns {*}
 */
var result = function (ctx, value) {
    return (typeof value === 'function') ? value.call(ctx) : value;
};

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
            return new Handlebars.SafeString(options.fn(opts, {data: {view: this, root: options.data.root}}));
        };
    }

    if (hash.pureRender) {
        var viewProto = View.prototype;

        var mock = {
            options: hash,
            model: hash.model,
            collection: hash.collection,

            getOption: function (key) {
                return mock.options[key] || View.prototype[key];
            }
        };

        var data = viewProto.serializeData.call(mock);
        var tagName =  escape(result(mock, hash.tagName || viewProto.tagName));
        var attributes = result(mock, hash.attributes || viewProto.attributes) || {};

        attributes['class'] = result(mock, hash.className || viewProto.className);

        var attributesArray = _.map(attributes, function (value, key) {
            return escape(key) + '="' + escape(value) + '"';
        });

        if (viewProto.templateHelpers) {
            _.extend(data, viewProto.templateHelpers.call(mock));
        }

        var html = '<' + tagName;

        if (attributesArray.length) {
            html += ' ' + attributesArray.join(' ');
        }

        html += '>';
        html += viewProto.template(data, {data: {view: parentView}});
        html += '</' + tagName + '>';

        return new Handlebars.SafeString(html);
    }

    if (hash.pureView) {
        var view = new View(hash);
        view.render();

        var content = new Handlebars.SafeString(view.el.outerHTML);

        view.destroy();

        return content;
    }

    if (parentView) {
        var onRender = function () {
            if (!parentView[name]) {
                console.error('Region is not initialized, may be view is destroyed');
            }
            else {
                var view = new View(hash);
                view.once('destroy', function () {
                    parentView.off('destroy', onDestroy);
                    parentView.regionManager.removeRegion(name);
                });
                parentView[name].show(view);
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
    var view = utils.extractView(this, options.hash, options),
        content = options.hash.content || this.content;

    if (content == null && view && view.options.content != null) {
        content = view.options.content;
    }

    if (typeof content === 'function') {
        return content.call(view, options.data.root);
    }

    if (content != null) {
        return content;
    }

    return '';
};

Handlebars.registerHelper('view', viewHelper);
Handlebars.registerHelper('content', contentHelper);

module.exports = viewHelper;
