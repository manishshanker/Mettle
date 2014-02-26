(function (Mettle) {
    "use strict";

    Mettle.noop = noop;
    Mettle.each = each;
    Mettle.currentLocation = function() {
        return location.href;
    };

    Mettle.LOG_LEVEL = {
        ERROR: 1,
        WARN: 2,
        INFO: 4,
        LOG: 8,
        ALL: 16,
        OFF: -1,
        CURRENT: 1
    };

    function getLogger(type) {
        return (window.console && window.console.log && function () {
            if (Mettle.LOG_LEVEL.CURRENT >= Mettle.LOG_LEVEL[type.toUpperCase()]) {
                if (console.log.apply) {
                    (console[type]?console[type]:console.log).apply(console, arguments);
                } else {
                    (console[type]?console[type]:console.log)(arguments);
                }
            }
        }) || Mettle.noop;
    }

    Mettle.logInfo = getLogger("info");
    Mettle.log = getLogger("log");
    Mettle.logError = getLogger("error");
    Mettle.logWarn = getLogger("warn");


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