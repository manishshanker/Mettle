(function (Mettle) {
    "use strict";

    Mettle.noop = noop;
    Mettle.each = each;
    Mettle.infoLogger = (window.console && window.console.log && function () {
        console.info.apply(console, arguments);
    }) || Mettle.noop;
    Mettle.logger = (window.console && window.console.log && function () {
        console.log.apply(console, arguments);
    }) || Mettle.noop;
    Mettle.errorLogger = (window.console && window.console.log && function () {
        console.error.apply(console, arguments);
    }) || Mettle.noop;
    Mettle.warningLogger = (window.console && window.console.log && function () {
        console.warn.apply(console, arguments);
    }) || Mettle.noop;

    function each(data, callback) {
        if (data) {
            if (data instanceof Array) {
                loopArray(data, callback);
            } else {
                loopObject(data, callback);
            }
        }
    }

    function loopObject(data, callback) {
        var d;
        if (data) {
            for (d in data) {
                if (data.hasOwnProperty(d)) {
                    callback(data[d], d);
                }
            }
        }
    }

    function loopArray(data, callback) {
        var i, l;
        if (data) {
            for (i = 0, l = data.length; i < l; i++) {
                callback(data[i], i);
            }
        }
    }

    function noop() {
    }

}(Mettle));