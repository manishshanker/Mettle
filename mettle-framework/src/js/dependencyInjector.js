(function (Mettle) {
    "use strict";

    var INJECT_TYPES = {
        "tmpl!" : function(ctx, name) {
            return Mettle.TemplateByURL(name);
        }
    };

    Mettle.dependencyInjector = injectDependencies;

    Mettle.dependencyInjector.define = function(type, fn) {
        INJECT_TYPES[type] = fn;
    };

    Mettle.dependencyInjector.define("controller!", function(ctx, name) {
        return new Mettle.ModuleNameSpace.controller[name](ctx.injectLocalMessageBus ? ctx.localMessageBus : ctx.messageBus);

    });

    Mettle.dependencyInjector.define("template!", function(ctx, name) {
        return new Mettle.ModuleNameSpace.template[name](ctx.injectLocalMessageBus ? ctx.localMessageBus : ctx.messageBus);
    });

    Mettle.dependencyInjector.define("service!", function(ctx, name) {
        return new Mettle.ModuleNameSpace.service[name](ctx.injectLocalMessageBus ? ctx.localMessageBus : ctx.messageBus);
    });

    Mettle.dependencyInjector.define("view!", function(ctx, name) {
        return new Mettle.ModuleNameSpace.view[name](ctx.injectLocalMessageBus ? ctx.localMessageBus : ctx.messageBus);
    });

    var TYPES = {
        "views": "view",
        "templates": "template",
        "services": "service",
        "controls": "controller"
    };

    function injectDependencies(ctx, dependencies) {
        if (window.Mettle_moduleLevelMessaging) {
            if (Mettle.Messaging && (dependencies instanceof Mettle.Messaging)) {
                ctx.messageBus = dependencies;
            }
            if (ctx.injectLocalMessageBus) {
                ctx.localMessageBus = (dependencies && dependencies.inject && dependencies.inject.localMessageBus) || new Mettle.Messaging();
            }
        } else {
            ctx.messageBus = new Mettle.Messaging();
        }

        var injectedDependencies = (dependencies && dependencies.inject) || (ctx.inject && (isFunction(ctx.inject) ? ctx.inject() : ctx.inject));

        injectedDependencies = injectDepUsingShorthand(injectedDependencies);

        Mettle.each(injectedDependencies, function (dependency, key) {
            var depType = /^controls$|^templates$|^views$|^services$/.exec(key);
            if (depType) {
                if (dependency instanceof Array) {
                    injectFromArray(dependency, ctx, key);
                } else if (isFunction(dependency)) {
                    ctx[key] = dependency.call(ctx, ctx);
                } else {
                    Mettle.each(dependency, function (dep, subSubKey) {
                        ctx[key] = ctx[key] || {};
                        ctx[key][subSubKey] = ctx[key][subSubKey] = {};
                        injectInCtx(ctx[key], subSubKey, getDep(dep, ctx, key));
                    });
                }
            } else {
                ctx[key] = getDep(dependency, ctx, key);
            }
        });
    }

    function injectFromArray(dependency, ctx, key) {
        Mettle.each(dependency, function (subDependency) {
            ctx[key] = ctx[key] || {};
            if (isString(subDependency)) {
                ctx[key][subDependency] = ctx[subDependency] || {};
                injectInCtx(ctx[key], subDependency, getDependencyInstance(ctx, key, subDependency));
            } else {
                Mettle.each(subDependency, function (dep, subSubKey) {
                    injectInCtx(ctx[key], subSubKey, getDep(dep, ctx, key));
                });
            }
        });
    }

    function getDep(dependency, ctx, key) {
        return isString(dependency) ? getDependencyInstance(ctx, key, dependency) : (isFunction(dependency) ? dependency() : dependency);
    }

    function injectInCtx(ctx, dependency, depInstance) {
        ctx[dependency] = depInstance;
    }

    function getDependencyInstance(ctx, key, dependency) {
        if (ctx.injector) {
            Mettle.ModuleNameSpace.dependency = Mettle.ModuleNameSpace.dependency || {};
            var depInjector = Mettle.ModuleNameSpace.dependency[ctx.injector];
            if (depInjector) {
                if (depInjector[key][dependency]) {
                    return depInjector[key][dependency](ctx);
                }
            }
        }
        return defaultInjector(ctx, key, dependency);
    }

    function capitalise(string) {
        return string.substr(0, 1).toUpperCase() + string.substr(1);
    }

    function defaultInjector(ctx, type, dependency) {
        if (dependency.indexOf(".")>0) {
            try {
                return getClassInstance(dependency, ctx.injectLocalMessageBus ? ctx.localMessageBus : ctx.messageBus);
            } catch(e) {
                Mettle.logError(e);
                throw new Error("Direct dependency instance creation error: (" + type + "," + dependency + " | " + (capitalise(dependency)) + ")");
            }
        }
        if (dependency.indexOf("!")>0) {
            try {
                var parts = /([\w\W]+?!)([\w\W]*)/.exec(dependency);
                return INJECT_TYPES[parts[1]](ctx, parts[2]);
            } catch(e) {
                Mettle.logError(e);
                throw new Error("Defined dependency instance creation error: (" + type + "," + dependency + " | " + (capitalise(dependency)) + ")");
            }
        }

        var moduleNameSpace = TYPES[type];
        Mettle.ModuleNameSpace[moduleNameSpace] = Mettle.ModuleNameSpace[moduleNameSpace] || {};
        if (type === "templates") {
            if (Mettle.ModuleNameSpace.template[capitalise(dependency)]) {
                return new Mettle.ModuleNameSpace.template[capitalise(dependency)]();
            }
            if (Mettle.ModuleNameSpace.template[dependency]) {
                return Mettle.ModuleNameSpace.template[dependency];
            }
            return Mettle.TemplateByID("tmpl" + capitalise(dependency));
        }
        try {
            return new Mettle.ModuleNameSpace[moduleNameSpace][capitalise(dependency)](ctx.injectLocalMessageBus ? ctx.localMessageBus : ctx.messageBus);
        } catch (e) {
            Mettle.logError(e);
            throw new Error("Dependency instance creation error: (" + type + "," + dependency + " | " + moduleNameSpace + "." + (capitalise(dependency)) + ")");
        }
    }


    function getClassInstance(dependency, param) {
        var Clazz = window;
        Mettle.each(dependency.split("."), function(dep) {
            Clazz = Clazz[dep]
        });
        return new Clazz(param);
    }

    function injectDepUsingShorthand(injectedDependencies) {
        if (isString(injectedDependencies)) {
            var dep = {};
            var parts = injectedDependencies.split(":");
            var classObjectName = parts[1];
            var types = parts[0];
            Mettle.each({
                "templates": /T/,
                "views": /V/,
                "services": /S/
            }, function (type, ns) {
                if (type.test(types)) {
                    dep[ns] = [classObjectName];
                }
            });
            injectedDependencies = dep;
        }
        return injectedDependencies;
    }

    function isFunction(dependency) {
        return typeof dependency === "function";
    }

    function isString(subDependency) {
        return typeof subDependency === "string";
    }

}(Mettle));