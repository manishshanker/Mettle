(function (Mettle, window) {
    "use strict";

    window.Mettle = Mettle = Mettle || {};

    Mettle.init = function (appNameSpace, locale) {
        Mettle.i18nT = locale;
        Mettle.Module = appNameSpace || {};
    };

}(window.Mettle, window));