(function(Mettle, $) {
    "use strict";

    Mettle.init = function (appNameSpace, locale, logLevel) {
        Mettle.i18nT = locale;
        Mettle.ModuleNameSpace = appNameSpace || {};
        Mettle.LOGGER_LEVEL.CURRENT = logLevel || Mettle.LOGGER_LEVEL.WARN;
        return Mettle;
    };

    Mettle.modules = function(modules) {
        Mettle.each(modules, function (ModuleClass) {
            new ModuleClass().load();
        });
        return Mettle;
    };

    Mettle.managedModules = function(modules) {
        var content = {};
        var destroyedModule = {};
        Mettle.each(modules, function (ModuleClass, moduleName) {

            var $moduleContainer = $("#" + moduleName);
            $moduleContainer.attr("data-keep-state", "false");
            var module = new ModuleClass();
            content[moduleName] = content[moduleName] || $moduleContainer.html();

            Mettle.messaging.subscribe(module.controlMessages.hide, function () {
                Mettle.infoLogger("destroying module:" + moduleName);
                module.destroy();
                $moduleContainer.empty();
                destroyedModule[moduleName] = true;
            });

            Mettle.messaging.subscribe(module.controlMessages.show, function (data) {
                if (destroyedModule[moduleName]) {
                    Mettle.infoLogger("loading destroyed module:" + moduleName);
                    $moduleContainer.html(content[moduleName]);
                    module = new ModuleClass();
                    module.load();
                    if (!data.redirecting) {
                        Mettle.messaging.publish(module.controlMessages.stateChange, data);
                    }
                } else {
                    module.load();
                }
                destroyedModule[moduleName] = false;
            });
        });
        return Mettle;
    };

    Mettle.start = function(defaultPage) {
        Mettle.navigation.load(defaultPage);
        return Mettle;
    };

}(Mettle, Mettle.DOM));