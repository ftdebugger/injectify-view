describe("Injectify view helper", function () {

    var Backbone = require("backbone");

    // fix bug in backbone
    Backbone.$ = require("jquery");
    window._ = require("underscore");

    // configure helper
    require("../marionette").setInstance(require("backbone.marionette"));

    // configre regions-extras
    require("regions-extras/marionette").setInstance(require("backbone.marionette"));
    require("regions-extras/handlebars").setInstance(require("injectify/runtime"));

    //register 'view' helper
    require("../index");

    it("include view", function () {
        var Layout = require("./fixture/Layout"),
            layout = new Layout();

        layout.render();
        expect(layout.test).toBeDefined();
        expect(layout.test.currentView).toBeDefined();
        expect(layout.test.currentView.$el.text()).toBe('internal rendered\n');

        expect(layout.$el.html()).toBe('Layout with internal view: <div>internal rendered\n</div>\n');
    });

    it("include view with params", function () {
        var model = new Backbone.Model({
            value: 123,
            inner: new Backbone.Model({
                value: 321
            })
        });
        var Layout = require("./fixture/ParamLayout"),
            layout = new Layout({model: model});

        layout.render();
        expect(layout.$el.html()).toBe('Layout param 123: <div>Internal 321\n</div>\n');
    });


});
