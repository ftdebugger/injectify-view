var Marionette = require('backbone.marionette');

module.exports = Marionette.View.extend({
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
