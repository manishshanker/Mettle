(function (Mettle, $) {
    "use strict";

    Mettle.View = Mettle.Base.extend({
        autoManageEventBind: false,
        autoLayout: false,
        appendViewTo: null,
        init: function (dependencies) {
            this.injectDependencies(dependencies);
            if (!this.appendViewTo) {
                initialise.call(this);
            }
        },
        container: null,
        $container: null,
        bindings: null,
        layoutChange: Mettle.noop,
        bind: function () {
            loopBindings(this, false);
        },
        unbind: function () {
            loopBindings(this, true);
        },
        $el: null,
        render: function (html) {
            if (this.appendViewTo) {
                $(this.appendViewTo === true ? "body" : this.appendViewTo).append(html);
                initialise.call(this);
            } else {
                this.$container.html(html);
            }
        },
        destroy: function () {
            var that = this;
            removeAutoLayoutHandler(that);
            that.unbind();
            that.$container.empty();
        },
        hide: function () {
            var that = this;
            that.$el.removeClass("show").addClass("hide");
            autoUnbindEvents(that);
            removeAutoLayoutHandler(that);
        },
        show: function () {
            var that = this;
            that.$el.removeClass("hide").addClass("show");
            autoBindEvents(that);
            addAutoLayoutHandler(that);
        }
    });

    function initialise() {
        this.$container = $(this.container);
        this.$el = this.$container.$item;
        if (!this.autoManageEventBind) {
            this.bind();
        }
        addAutoLayoutHandler(this);
    }

    function getBindings(ctx) {
        return typeof ctx.bindings === "function" ? ctx.bindings() : ctx.bindings;
    }

    function loopBindings(ctx, unBind) {
        var bindings = getBindings(ctx);
        var method = unBind ? unBindEvent : bindEvent;
        Mettle.each(bindings, function (fn, key) {
            var keyParts = /([a-zA-Z]+)\s([a-zA-Z0-9\-\.\(\)>]+)/.exec(key);
            method(keyParts, ctx.$container, key, ctx, fn);
        });
    }

    function bindEvent(keyParts, $container, eventName, ctx, fn) {
        if (keyParts) {
            $container.on(keyParts[1], keyParts[2], function (e) {
                return fn.call(ctx, e, this);
            });
        } else {
            $container.on(eventName, function (e) {
                return fn.call(ctx, e, this);
            });
        }
    }

    function unBindEvent(parts, $container, eventName) {
        if (parts) {
            $container.off(parts[1], parts[2]);
        } else {
            $container.off(eventName);
        }
    }

    function addAutoLayoutHandler(that) {
        if (that.autoLayout) {
            $(window).off("resize." + that.guid()).on(("resize." + that.guid()), function () {
                that.layoutChange();
            });
        }
    }

    function removeAutoLayoutHandler(that) {
        if (that.autoLayout) {
            $(window).off("resize." + that.guid());
        }
    }

    function autoUnbindEvents(that) {
        if (that.autoManageEventBind) {
            that.unbind();
        }
    }

    function autoBindEvents(that) {
        if (that.autoManageEventBind) {
            that.bind();
        }
    }

}(Mettle, Mettle.DOM));