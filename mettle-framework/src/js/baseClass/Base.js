(function (Mettle) {
    "use strict";

    Mettle.Base = Class.extend({
        messageBus: Mettle.messageBus,
        injector: null,
        guid: null,
        init: function() {
            this.guid = guid();
        },
        injectDependencies: function (dependencies) {
            Mettle.dependencyInjector(this, dependencies);
        }
    });

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

}(Mettle));