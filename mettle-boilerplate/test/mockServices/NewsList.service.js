(function () {
    "use strict";

    var interval;

    APP.service.NewsList = APP.service.NewsList.extend({
        fetch: function () {
            this.updated(getMockData());
        },
        init: function () {
            var that = this;
            that._super();
            interval = setInterval(function () {
                that.fetch();
            }, 5000);
        },
        destroy: function() {
            this._super();
            clearInterval(interval);
        }
    });

    function getMockData() {
        return (function () {
            var items = [];
            var n = 0;
            while (n < 20) {
                items.push({
                    id: n,
                    title: "News " + n + new Date().getSeconds(),
                    description: "Description " + n + ": " + new Date().toLocaleTimeString() + " lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
                });
                n++;
            }
            return items;
        }());
    }
}());

