(function (window) {
    "use strict";
    //noinspection JSUnresolvedVariable
    if (window.addEventListener && window.applicationCache) {

        window.addEventListener('load', function () {
            //noinspection JSUnresolvedVariable
            window.applicationCache.addEventListener('updateready', function () {
                //noinspection JSUnresolvedVariable
                if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
                    // Browser downloaded a new app cache.
                    if (confirm('A new version of this application is available. Load it?')) {
                        window.location.reload();
                    }
                }
            }, false);
        }, false);

    }
}(window));

