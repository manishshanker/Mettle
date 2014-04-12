(function (Mettle, $) {
    "use strict";

    var Messaging = function () {
        this.guid = guid();
        this.localMessageBus = $({});
        Mettle.logInfo("messageBus._____create", this.guid);
    };

    Messaging.prototype = {
        publish: function (subject, message) {
            Mettle.logInfo("messageBus.____publish", this.guid, subject, message);
            this.localMessageBus.trigger(subject, [message]);
        },
        subscribe: function (scope, subjects, fn) {
            if (typeof scope === "string") {
                fn = subjects;
                subjects = scope;
                scope = window;
            }
            Mettle.logInfo("messageBus.__subscribe", this.guid, subjects);
            var that = this;
            if (typeof subjects === "string") {
                return getSubscriber(that, fn, scope, subjects);
            }
            if (arguments.length===1) {
                subjects = scope;
            }
            var subscriberFNs = {};
            Mettle.each(subjects, function (fn, subject) {
                subscriberFNs[subject] = getSubscriber(that, fn, scope, subject);
            });
            return subscriberFNs;
        },
        unsubscribe: function (subjects, fn) {
            Mettle.logInfo("messageBus.unsubscribe", this.guid, subjects);
            var that = this;
            if (typeof subjects === "string") {
                that.localMessageBus.off(subjects, fn);
            } else {
                Mettle.each(subjects, function (fn, subject) {
                    that.localMessageBus.off(subject, fn);
                });
            }
        }
    };

    function getSubscriber(ctx, fn, scope, subject) {
        var unsubscribeMethod = function (e, message) {
            Mettle.logInfo("messageBus.___received", subject, message);
            fn.call(scope, message);
        };
        ctx.localMessageBus.on(subject, unsubscribeMethod);
        return unsubscribeMethod;
    }

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    Mettle.messageBus = new Messaging();
    Mettle.Messaging = Messaging;

}(Mettle, Mettle.DOM));