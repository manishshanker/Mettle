(function (Mettle) {
    "use strict";

    Mettle
        .init(APP, APP.i18nT)
        .modules({
            news: APP.controller.News
        })
        .start("introduction");

}(Mettle));