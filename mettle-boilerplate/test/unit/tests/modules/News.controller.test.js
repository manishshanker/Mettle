require("js/app/modules/News/News.controller.js");
require("js/app/modules/News/controls/newsList/NewsList.service.js");
require("js/app/modules/News/controls/newsList/NewsList.controller.js");
require("js/app/modules/News/controls/newsList/NewsList.view.js");
require("js/app/modules/News/controls/newsDetail/NewsDetail.service.js");
require("js/app/modules/News/controls/newsDetail/NewsDetail.controller.js");
require("js/app/modules/News/controls/newsDetail/NewsDetail.view.js");
require("../../test/mockServices/NewsList.service.js");
describe("News.controller", function () {

    var $fragments;

    describe(".init", function () {
        it("should call service fetch", function () {
            $fragments = $("#fragments");
            $fragments.html("<div id='tmplNewsList'>{{title}}</div><div id='tmplNewsDetail'>{{title}}</div>");
            var newsListService = new APP.service.NewsList();
            var newsDetailService = new APP.service.NewsDetail();
            var mockService = sinon.mock(newsListService);
            var mockServiceExpectation = mockService.expects("fetch").once();
            var controller = new APP.controller.News({
                inject: {
                    services: {
                        newsList: newsListService,
                        newsDetail: newsDetailService
                    },
                    controls: {
                        newsList: new APP.controller.NewsList(),
                        newsDetail: new APP.controller.NewsDetail()
                    }
                }
            });
            controller.load();
            Mettle.messaging.publish("navigationChangedTo:example", {});
            mockServiceExpectation.verify();
            mockService.restore();
        });
    });

    describe(".load", function () {
        it("should subscribe to events", function () {
            $fragments = $("#fragments");
            $fragments.html("<div id='tmplNewsList'>{{title}}</div><div id='tmplNewsDetail'>{{title}}</div>");
            var mockNavView = sinon.mock(Mettle.messaging);
            var expectation = mockNavView.expects("subscribe").thrice();
            var controller = new APP.controller.News();
            controller.load();
            expectation.verify();
            mockNavView.restore();
        });
    });

    describe(".destroy", function () {
        it("should call destroy without failure", function () {
            $fragments = $("#fragments");
            $fragments.html("<div id='tmplNewsList'>{{title}}</div><div id='tmplNewsDetail'>{{title}}</div>");
            var controller = new APP.controller.News();
            controller.load();
            Mettle.messaging.publish("navigationChangedTo:example", {});
            controller.destroy();
        });
    });
});
