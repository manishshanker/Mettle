(function (Mettle) {
    "use strict";

    APP.controller.News = Mettle.Controller.extend({
        autoWire: true,
        lastSelectedNewsItem: null,
        inject: {
            services: ["newsDetail", "newsList"],
            controls: ["newsList", "newsDetail"]
        },
        serviceUpdate: {
            /*resetting the state back after re-render*/
            newsList: function (newsList) {
                updateNews(this, newsList, this.lastSelectedNewsItem);
            }
        },
        routes: {
            "/example/news/:id": function (id) {
                this.lastSelectedNewsItem = id;
                updateNews(this, this.controls.newsList, id);
            }
        },
        controlMessages: {
            show: "navigationChangedTo:example",
            hide: "navigationChangedFrom:example",
            stateChange: "navigationStateChange:example"
        }
    });

    function updateNews(ctx, newsList, newsItemId) {
        newsList.selectItem(newsItemId);
        ctx.services.newsDetail.fetch(ctx.services.newsList.lastResult(), newsItemId);
    }

}(Mettle));