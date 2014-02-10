(function (Mettle) {
    "use strict";

    APP.service.NewsList = Mettle.Service.extend({
        dataURL: APP.serviceURL.newsList.fetch
    });

}(Mettle));

