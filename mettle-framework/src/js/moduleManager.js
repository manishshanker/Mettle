(function(Mettle, $) {
    "use strict";

    Mettle.init = function (appNameSpace, locale, logLevel) {
        Mettle.i18nT = locale;
        Mettle.ModuleNameSpace = appNameSpace || {};
        Mettle.LOG_LEVEL.CURRENT = logLevel || Mettle.LOG_LEVEL.WARN;
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

            Mettle.messaging.subscribe(module.controlMessages.hide, function (data) {
                Mettle.logInfo("destroying module:" + moduleName);
                module.destroy();
                $moduleContainer.empty();
                module = null;
                destroyedModule[moduleName] = true;
            });

            Mettle.messaging.subscribe(module.controlMessages.show, function (data) {
                if (destroyedModule[moduleName]) {
                    Mettle.logInfo("loading destroyed module:" + moduleName);
                    $moduleContainer.html(content[moduleName]);
                    module = new ModuleClass();
                } else {
                    Mettle.logInfo("loading module:" + moduleName);
                }
                module.load();
                module.show(data);
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