(function (Mettle, $) {
    "use strict";

    var currentView;
    var currentPath;
    var viewState = {};
    var dView = "#/home";

    var Navigation = function () {

        function load(defaultView) {
            dView = defaultView;
            $(window).on("hashchange", onLocationChange);
            if (location.hash) {
                onLocationChange();
            } else {
                location.href = "#/" + dView;
            }
        }

        function onLocationChange() {
            currentPath = location.hash;
            var redirect = false;
            var appStateData = parseLocationData(currentPath);
            if (!appStateData) {
                location.href = "#/" + dView;
                return;
            }
            if (appStateData.page !== currentView) {
                hidePage(currentView, appStateData);
                currentView = appStateData.page;
                redirect = showPage(currentView, appStateData);
                if (redirect) {
                    return;
                }
            }
            var newAppStateData = parseLocationData(location.hash);
            currentView = newAppStateData.page;

            if (!isKeepOldState(currentView) || isNotSameState(newAppStateData)) {
                publishStateUpdate(newAppStateData);
                viewState[currentView] = appStateData;
            }
        }

        function isNotSameState(newAppStateData) {
            return (!viewState[currentView] || (newAppStateData.pageData !== viewState[newAppStateData.page].pageData));
        }

        function publishStateUpdate(appStateData) {
            Mettle.messaging.publish("navigationStateChange:" + currentView, appStateData);
            Mettle.messaging.publish("navigationStateChange", appStateData);
        }

        function hidePage(page, appStateData) {
            if (page) {
                $("a[href$='#/" + page + "']").removeClass("selected");
                $("#" + page).removeClass("page-visible");
                Mettle.messaging.publish("navigationChangedFrom:" + page, appStateData);
            }
        }

        function showPage(page, appStateData) {
            $("#" + page).addClass("page-visible");
            var $link = getPageLink(page);
            $link.addClass("selected");
            var cachedViewState = viewState[page];
            var redirecting = false;
            if (cachedViewState && (cachedViewState.pageData !== appStateData.pageData)) {
                if (cachedViewState.pageData) {
                    Mettle.logInfo("redirecting to restore state of " + currentView);
                    location.replace("#/" + page + "/" + cachedViewState.pageData);
                    redirecting = true;
                }
            }
            Mettle.messaging.publish("navigationChangedTo:" + currentView, appStateData);
            return redirecting;
        }

        function isKeepOldState(page) {
            var keepState = getPageContainer(page).attr("data-keep-state");
            return !(keepState === false || keepState === "false");
        }

        function getPageContainer(page) {
            return $("#" + page);
        }


        function getPageLink(page) {
            return $("a[href$='#/" + page + "']");
        }

        function parseLocationData(locationData) {
            var a = /#\/([a-zA-Z_\-0-9\$]+)(\/([\w\W]+))?/.exec(locationData);
            if (!a) {
                return null;
            }
            return {
                path: locationData,
                page: a[1],
                pageData: a[3],
                keepPreviousState: isKeepOldState(a[1])
            };
        }

        function setRoute(route) {
            currentPath = route;
            location.hash = route;
            if (window.hasOwnProperty("onhashchange")) {
                onLocationChange();
            }
        }

        function route(context, pattern, callback, callbackFailure) {
            var items = new RegExp(("^" + pattern + "$").replace("?", ".").replace(/:[a-zA-Z0-9-_]+/g, function (a) {
                return "([a-zA-Z0-9-_]+)";
            })).exec(currentPath.substring(1).replace(/[\/]?$/, ""));
            if (items) {
                items.splice(0, 1);
                callback.apply(context, items);
            } else {
                if (callbackFailure) {
                    callbackFailure.call(context);
                }
            }
        }

        return {
            load: load,
            route: route,
            setRoute: setRoute
        };
    };

    Mettle.navigation = new Navigation();
}(Mettle, Mettle.DOM));