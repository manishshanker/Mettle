(function (Mettle) {
    "use strict";

    Mettle.Controller = Mettle.Base.extend({
        autoWire: false,
        autoDestroy: false,
        autoShowHide: false,
        autoLoadControls: false,
        autoLayout: false,
        messages: null,
        injectLocalMessageBus: false,
        inject: null,
        routes: {},
        serviceUpdate: {},
        messageBus: Mettle.messageBus,
        localMessageBus: null,
        init: function (dependencies) {
            this.injectDependencies(dependencies);
        },
        views: null,
        templates: null,
        controls: null,
        services: null,
        shownAndLoaded: false,
        layoutChange: function () {
            if (this.autoLayout) {
                loopMethods(this.controls, "layoutChange");
                loopMethods(this.views, "layoutChange");
            }
        },
        load: function () {
            subscribeToMessages(this);
            autoLoadControls(this);
        },
        loadOnce: function () {
            if (!this._loaded) {
                this.load();
                this._loaded = true
            }
        },
        unload: function () {
            destroyMessages(this);
            unloadControls(this);
        },
        update: function (data) {
            autoRenderTemplates(this, data);
        },
        onUpdateReceive: function (data, item) {
            onUpdateReceive(this, data, item);
        },
        destroy: function () {
            destroy(this);
        },
        onRouteChange: function () {
            return this.routes;
        },
        onServiceUpdate: function () {
            return this.serviceUpdate;
        },
        hide: function (data) {
            autoStopServices(this);
            if (!(data && data.keepPreviousState)) {
                autoShowHide(this, false, arguments);
                autoDestroy(this);
            }
        },
        show: function (data) {
            if (!this.shownAndLoaded) {
                autoShowAndInitServices(this, arguments);
                this.shownAndLoaded = true;
            } else if (data && data.keepPreviousState) {
                autoStartServices(this);
            } else {
                autoShowAndStartServices(this, arguments);
            }
        }
    });

    function autoShowAndInitServices(ctx, args) {
        autoShowHide(ctx, true, args);
        autoInitServices(ctx);
    }

    function autoShowAndStartServices(ctx, args) {
        autoShowHide(ctx, true, args);
        autoStartServices(ctx);
    }

    function unloadControls(ctx) {
        loopMethods(ctx.controls, "unload");
    }

    function autoLoadControls(ctx) {
        if (ctx.autoLoadControls) {
            loopMethods(ctx.controls, "load");
        }
    }

    function autoInitServices(ctx) {
        if (!ctx._exist && ctx.autoWire) {
            initServices(ctx.services, ctx);
        }
        ctx._exist = true;
    }

    function autoDestroy(ctx) {
        if (ctx.autoDestroy) {
            ctx.destroy();
        }
    }

    function autoStartServices(ctx) {
        if (ctx.autoWire) {
            loopMethods(ctx.services, "start");
        }
    }

    function autoStopServices(ctx) {
        if (ctx.autoWire) {
            loopMethods(ctx.services, "stop");
        }
    }

    function onUpdateReceive(ctx, data, item) {
        ctx.controls[item].update(data);
        if (ctx.lastStateData && ctx.onServiceUpdate()[item]) {
            ctx.onServiceUpdate()[item].call(ctx, ctx.controls[item], ctx.lastStateData);
        }
    }

    function autoRenderTemplates(ctx, data) {
        if (ctx.autoWire) {
            renderTemplates(ctx, data);
        }
    }

    function destroy(ctx) {
        destroyControlMessages(ctx);
        destroyMessages(ctx);
        loopMethods(ctx.views, "destroy");
        loopMethods(ctx.controls, "destroy");
        loopMethods(ctx.services, "destroy");
        loopMethods(ctx.templates, "destroy");
        ctx.services = null;
        ctx.views = null;
        ctx.lastStateData = null;
        ctx.templates = null;
        ctx.options = null;
        ctx.controls = null;
        ctx._exist = false;
        ctx._loaded = false;
        ctx.shownAndLoaded = false;
    }

    function destroyControlMessages(ctx) {
        if (ctx._controlMessagesFn) {
            var controlMessages = ctx.controlMessages;
            var controlMessagesFn = ctx._controlMessagesFn;
            Mettle.each(["show", "hide", "stateChange"], function(item) {
                Mettle.messageBus.unsubscribe(controlMessages[item], controlMessagesFn[item]);
            });
        }
    }

    function destroyMessages(ctx) {
        if (ctx._messagesFn) {
            Mettle.each(ctx.messages, function (item, key) {
                Mettle.messageBus.unsubscribe(item, ctx._messagesFn(key));
            });
        }
    }

    function renderTemplates(ctx, data) {
        Mettle.each(ctx.templates, function (template, key) {
            template.load(function () {
                if (ctx.views[key]) {
                    ctx.views[key].render(template.process(data));
                }
            });
        });
    }

    function loopMethods(collection, method, args) {
        args = args || [];
        Mettle.each(collection, function (item) {
            item[method].apply(item, args);
        });
    }

    function initServices(services, that) {
        Mettle.each(services, function (service, key) {
            service.onUpdate(getFunction(that, key));
            service.fetch();
        });
    }

    function getFunction(scope, service) {
        return function (data) {
            scope.onUpdateReceive(data, service);
        };
    }

    function subscribeToMessages(ctx) {
        if (!(ctx.messages || ctx.controlMessages)) {
            return;
        }
        destroyControlMessages(ctx);
        var messages = ctx.controlMessages;
        ctx._controlMessagesFn = {};
        ctx._controlMessagesFn.show = Mettle.messageBus.subscribe(ctx, messages.show, ctx.show);
        ctx._controlMessagesFn.hide = Mettle.messageBus.subscribe(ctx, messages.hide, ctx.hide);
        ctx._controlMessagesFn.stateChange = Mettle.messageBus.subscribe(ctx, messages.stateChange, function (stateData) {
            ctx.lastStateData = stateData;
            Mettle.each(ctx.onRouteChange(stateData), function (item, key) {
                Mettle.navigation.route(ctx, key, item);
            });
        });
        destroyMessages(ctx);
        ctx._messagesFn = {};
        Mettle.each(ctx.messages, function (message, key) {
            ctx._messagesFn[key] = Mettle.messageBus.subscribe(ctx, key, message);
        });
    }

    function autoShowHide(that, isShow, args) {
        if (that.autoShowHide) {
            loopMethods(that.views, isShow ? "show" : "hide", args);
            loopMethods(that.controls, isShow ? "show" : "hide", args);
        }
    }

}(Mettle));