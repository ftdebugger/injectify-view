Injectify view helper [![Build Status](https://travis-ci.org/ftdebugger/injectify-view.svg)](https://travis-ci.org/ftdebugger/injectify-view)
========================

Additional helper for handlebars, include `marionette` or `backbone` views into template and inject it to parent LayoutView.

Install
-------

```
npm install --save-dev injectify injectify-view
```

Usage
-----

Configure `gulp`:

```js
    var gulp = require("gulp"),
        browserify = require("browserify"),
        source = require("vinyl-source-stream"),
         
    require("injectify-view/inject");
        
    gulp.task('js', function () {
        var bundleStream = browserify('./src/index.js')
            .transform(require("injectify"))
            .bundle();

        return bundleStream
            .pipe(source('index.js'))
            .pipe(gulp.dest('dist'));
    });
```

If `Marionette` defined globally you need to do nothing. Elsewhere:

```js
// configure helper
require("injectify-view/marionette").setInstance(require("backbone.marionette"));
```

In file `./src/index.js` require injectify `view` helper:

```js
require("injectify-view");
```

Now you can use `view` helper in your templates. For example define layout:

```js
var Layout = Marionette.Layout.extend({
    template: require("./tpl/Layout.hbs")
});

```

and template

```handlebars
Layout with internal view: {{view "../Internal" "test" model=user someOption=123}}

Attributes of view helper:

1. Path to module with Backbone.View or Marionette.View
2. Name of region, that will appear on parent Layout. Optional. It will generate unique name for you
3. Hash will be pass to view constructor, you can specify options and models in it
```

In `Layout` will be created `test` region and view will be putted in.

`view` helper works like original browserify `require`. You can require modules relative to template file or
node_modules directory.
