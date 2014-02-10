(function (Mettle) {
    "use strict";

    APP.controller.NewsDetail = Mettle.Controller.extend({
        autoWire: true,
        injector: "NewsDetail",
        inject: {
            templates: {newsDetail: "tmpl!newsDetail"},
            views: ["newsDetail"]
        }
    });

}(Mettle));