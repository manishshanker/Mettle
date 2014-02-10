(function (Mettle) {
    "use strict";

    Mettle.dependencyInjector = injectDependencies;

    var TYPES = {
        "views": "view",
        "templates": "template",
        "services": "service",
        "controls": "controller"
    };

    function injectDependencies(ctx, dependencies) {
        if (Mettle.Messaging && (dependencies instanceof Mettle.Messaging)) {
            ctx.messageBus = dependencies;
        }
        if (ctx.injectLocalMessageBus) {
            ctx.localMessageBus = (dependencies && dependencies.inject && dependencies.inject.localMessageBus) || new Mettle.Messaging();
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
            Mettle.Module.dependency = Mettle.Module.dependency || {};
            var depInjector = Mettle.Module.dependency[ctx.injector];
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
                Mettle.errorLogger(e);
                throw new Error("Direct dependency instance creation error: (" + type + "," + dependency + " | " + (capitalise(dependency)) + ")");
            }
        }
        var moduleNameSpace = TYPES[type];
        Mettle.Module[moduleNameSpace] = Mettle.Module[moduleNameSpace] || {};
        if (type === "templates") {
            if (Mettle.Module.template[capitalise(dependency)]) {
                return new Mettle.Module.template[capitalise(dependency)]();
            }
            if (Mettle.Module.template[dependency]) {
                return Mettle.Module.template[dependency];
            }
            if (dependency.indexOf("tmpl!") === 0) {
                return Mettle.TemplateByURL(dependency.substr(5));
            }
            return Mettle.TemplateByID("tmpl" + capitalise(dependency));
        }
        try {
            return new Mettle.Module[moduleNameSpace][capitalise(dependency)](ctx.injectLocalMessageBus ? ctx.localMessageBus : ctx.messageBus);
        } catch (e) {
            Mettle.errorLogger(e);
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