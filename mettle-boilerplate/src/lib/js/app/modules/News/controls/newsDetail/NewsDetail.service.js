(function (Mettle, $) {
    "use strict";

    APP.service.NewsDetail = Mettle.Service.extend({
        fetch: function (newsList, selectedItemId, callback) {
            callback = callback || this.updated;
            if (newsList) {
                var details = $.grep(newsList, function (item) {
                    return String(item.id) === String(selectedItemId);
                })[0];
                callback.call(this, details);
            } else {
                callback.call(this, {});
            }
        }
    });

}(Mettle, Mettle.DOM));
