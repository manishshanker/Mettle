(function (Mettle) {
    "use strict";

    Mettle.init(APP, APP.i18nT);
    (new APP.controller.News()).load();
    Mettle.navigation.load("introduction");

}(Mettle));