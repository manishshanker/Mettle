(function () {
    "use strict";

    var Class = function () {
    };
    var isFn = function (fn) {
        return typeof fn === "function";
    };
    Class.extend = function (proto) {
        var k = function (param) {
            if (param !== isFn && isFn(this.init)) {
                this.init.apply(this, arguments);
            }
        };
        k.prototype = new this(isFn);
        var makeSuper = function (fn, sfn) {
            return function () {
                //noinspection JSPotentiallyInvalidUsageOfThis
                this._super = sfn;
                return fn.apply(this, arguments);
            };
        };
        var key;
        for (key in proto) {
            if (proto.hasOwnProperty(key)) {
                var fn = proto[key], sfn = k.prototype[key];
                k.prototype[key] = !isFn(fn) || !isFn(sfn) ? fn : makeSuper(fn, sfn); // add _super method
            }
        }
        k.prototype.constructor = k;
        k.extend = this.extend;
        return k;
    };

    window.Class = Class;
}());