import Handlebars from 'injectify/runtime';
import utils from 'injectify/utils';
import regionHelper from 'regions-extras';
import {toArray, clone, map, extend} from 'lodash';

let escape = Handlebars.Utils.escapeExpression;

/**
 * @param {{}} ctx
 * @param {function|*} value
 *
 * @returns {*}
 */
let result = function (ctx, value) {
    return (typeof value === 'function') ? value.call(ctx) : value;
};

/**
 * @param {Backbone.View} View
 * @param {String} [name]
 * @param {Object} [hash]
 * @param {Object} options
 * @returns {*}
 */
let viewHelper = function () {
    let args = utils.extractArguments(this, toArray(arguments)),
        options = args.options,
        View = args.module,
        hash = args.hash,
        parentView = args.parentView,
        name = args.name;

    if (options.fn) {
        hash.content = function (opts) {
            opts = clone(opts);
            delete opts.content;
            return new Handlebars.SafeString(options.fn(opts, {data: {view: this}}));
        };
    }

    if (hash.pureRender) {
        let viewProto = View.prototype;

        let mock = {
            options: hash,
            model: hash.model,
            collection: hash.collection,

            getOption: function (key) {
                return mock.options[key] || View.prototype[key];
            }
        };

        let data = viewProto.serializeData.call(mock);
        let tagName =  escape(result(mock, hash.tagName || viewProto.tagName));
        let attributes = result(mock, hash.attributes || viewProto.attributes) || {};

        attributes['class'] = result(mock, hash.className || viewProto.className);

        let attributesArray = map(attributes, function (value, key) {
            return escape(key) + '="' + escape(value) + '"';
        });

        if (viewProto.templateHelpers) {
            extend(data, viewProto.templateHelpers.call(mock));
        }

        let html = '<' + tagName;

        if (attributesArray.length) {
            html += ' ' + attributesArray.join(' ');
        }

        html += '>';
        html += viewProto.template(data, {data: {view: parentView}});
        html += '</' + tagName + '>';

        return new Handlebars.SafeString(html);
    }

    if (hash.pureView) {
        let view = new View(hash);
        view.render();

        let content = new Handlebars.SafeString(view.el.outerHTML);

        view.destroy();

        return content;
    }

    if (parentView) {
        let onRender = function () {
            let region = parentView.getRegion(name);

            if (!region) {
                console.error('Region is not initialized, may be view is destroyed');
            } else {
                region.show(new View(hash));
            }
        };

        let onDestroy = function () {
            parentView.off('render', onRender);
        };

        parentView.once('render', onRender);
        parentView.once('destroy', onDestroy);
    } else {
        console.warn('Cannot find "view" for handlebars view helper "' + name + '"');
    }

    let regionHash = clone(hash);
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
let contentHelper = function (options) {
    let view = utils.extractView(this, options.hash, options),
        content = this.content;

    if (content == null && view && view.options.content != null) {
        content = view.options.content;
    }

    if (typeof content === 'function') {
        return content.call(view, options.data.root, {
            data: options.data
        });
    }

    if (content != null) {
        return content;
    }

    return '';
};

Handlebars.registerHelper('view', viewHelper);
Handlebars.registerHelper('content', contentHelper);

module.exports = viewHelper;
