(function (Mettle, $) {
    "use strict";

    var privateVar = {};

    Mettle.Service = Mettle.Base.extend({
        dataURL: null,
        init: function () {
            privateVar[this.guid()] = {};
            privateVar[this.guid()].updateCallBack = [];
        },
        fetch: function () {
            $.get(this.dataURL, function (data) {
                this.updated(data);
            });
        },
        update: Mettle.noop,
        get: Mettle.noop,
        lastResult: function () {
            return privateVar[this.guid()].lastResult;
        },
        onUpdate: function (callback) {
            privateVar[this.guid()].updateCallBack.push(callback);
        },
        updated: function (data) {
            var n, l;
            var localPrivateVar = privateVar[this.guid()];
            localPrivateVar.lastResult = data;
            if (localPrivateVar) {
                for (n = 0, l = localPrivateVar.updateCallBack.length; n < l; n++) {
                    localPrivateVar.updateCallBack[n](data);
                }
            }
        },
        destroy: function () {
            delete privateVar[this.guid()];
        },
        stop: Mettle.noop,
        start: Mettle.noop
    });

}(Mettle, Mettle.DOM));