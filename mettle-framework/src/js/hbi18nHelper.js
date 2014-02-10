/*i18n Handlebar helper*/
(function (Mettle) {
    "use strict";

    Handlebars.registerHelper('i18n', function (i18n_key, alias_key) {
        alias_key = typeof alias_key === "object" ? null : alias_key;
        return new Handlebars.SafeString(Mettle.i18n(i18n_key, alias_key));
    });
}(Mettle));