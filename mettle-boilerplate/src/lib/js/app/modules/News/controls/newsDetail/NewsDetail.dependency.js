(function () {
    "use strict";

    APP.dependency.NewsDetail = {
        templates: {
            newsDetail: function () {
                return new Mettle.Template("tmplNewsDetail");
            }
        },
        views: {
            newsDetail: function () {
                return new APP.view.NewsDetail();
            }
        }
    };

}());