describe("NewsList.view", function () {
    "use strict";

    describe(".selectItem", function () {
        it("should add selected class on selected item", function () {
            Mettle.init(APP);
            var $fragments = $("<div id='fragments'></div>");
            $fragments.html("<div id='newsItem_1'>{{title}}</div>");
            $("body").append($fragments);
            var view = new APP.view.NewsList();
            var $newsItem1 = $("#newsItem_1");
            expect($newsItem1.attr("class")).not.toMatch(/selected/);
            view.selectItem(1);
            expect($newsItem1.attr("class")).toMatch(/selected/);
            $fragments.remove();
        });
    });

});
