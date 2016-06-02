var Marionette = require('backbone.marionette');

module.exports = Marionette.LayoutView.extend({
    tagName: 'span',
    className: 'test',
    attributes: {
        id: 'pureTest'
    },
    template: require('./tpl/PureLayout.hbs'),

    serializeData: function () {
        return {
            value: this.options.value
        };
    }
});
