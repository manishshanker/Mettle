(function (HB) {
    "use strict";

    HB.registerHelper('list', function (items, className, options) {
        var out, i, l, listCSSClass = "", listItemCSSClass = "";
        if (typeof className === "string") {
            listCSSClass = " class='" + className + "' ";
            listItemCSSClass = " class='" + className + "-item' ";
        } else {
            options = className;
        }
        out = "<ul" + listCSSClass + ">";
        if (items && items.length) {
            for (i = 0, l = items.length; i < l; i++) {
                out += "<li" + listItemCSSClass + ">" + options.fn(items[i]) + "</li>";
            }
        }
        return out + "</ul>";
    });

}(Handlebars));