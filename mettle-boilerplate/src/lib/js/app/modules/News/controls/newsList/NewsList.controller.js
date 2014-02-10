(function (Mettle) {
    "use strict";

    APP.controller.NewsList = Mettle.Controller.extend({
        autoWire: true,
        inject: function () {
            return {
                templates: {
                    newsList: new Mettle.Template("tmplNewsList")
                },
                views: {
                    newsList: new APP.view.NewsList()
                }
            };
        },
        selectItem: function (id) {
            this.views.newsList.selectItem(id);
        }
    });

}(Mettle));