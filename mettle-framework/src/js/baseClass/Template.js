(function (Mettle, window) {
    "use strict";

    var templateCache = {};

    Mettle.TemplateByString = function (string) {
        return new Mettle.Template(string, Mettle.Template.LOAD.BY_STRING);
    };

    Mettle.TemplateByID = function (string) {
        return new Mettle.Template(string, Mettle.Template.LOAD.BY_ID);
    };

    Mettle.TemplateByURL = function (string) {
        return new Mettle.Template(string, Mettle.Template.LOAD.BY_URL);
    };

    Mettle.TemplateSafeString = function (template) {
        return new Mettle.templateEngine.safeString(template);
    };

    Mettle.Template = Mettle.Base.extend({
        init: function (path, loadType) {
            this.path = path;
            this.loadBy = loadType || Mettle.Template.LOAD.DEFAULT;
        },
        process: function (data) {
            if (this.path === undefined) {
                return "";
            }
            if (!templateCache[this.guid()]) {
                console.log("Template param: ", this.path, this.loadBy);
                throw new Error("Template not in cache!!");
            }
            return Mettle.templateEngine.process(templateCache[this.guid()], data);
        },
        load: function (onSuccess) {
            var that = this;
            if (this.path === undefined || templateCache[this.guid()]) {
                onSuccess();
            } else {
                if (that.loadBy === Mettle.Template.LOAD.BY_URL) {
                    var path = addExtension(addForwardSlash(Mettle.Template.LOAD.BY_URL_DEFAULT_PATH) + that.path);
                    Mettle.templateEngine.getByURL(path, function (template) {
                        templateCache[that.guid()] = template;
                        onSuccess.call(that);
                    });
                } else if (this.loadBy === Mettle.Template.LOAD.BY_ID) {
                    templateCache[this.guid()] = Mettle.templateEngine.getById(this.path);
                    Mettle.templateEngine.remove(this.path);
                    setTimeout(function () {
                        onSuccess.call(that);
                    }, 5);
                } else {
                    templateCache[this.guid()] = Mettle.templateEngine.getByString(this.path);
                    setTimeout(function () {
                        onSuccess.call(that);
                    }, 5);
                }
            }
        },
        destroy: function () {
            delete templateCache[this.guid()];
        }
    });

    function addExtension(path) {
        return path + (/\.[a-z]{3,4}$/.test(path) ? "" : Mettle.Template.LOAD.BY_URL_DEFAULT_EXTENSION);
    }

    function addForwardSlash(path) {
        return path + (/\/$/.test(path) ? "" : "/");
    }

    Mettle.Template.LOAD = {
        BY_ID: "APP_TEMPLATE_BY_ID",
        BY_URL: "APP_TEMPLATE_BY_URL",
        BY_STRING: "APP_TEMPLATE_BY_STRING",
        DEFAULT: "APP_TEMPLATE_BY_ID",
        BY_URL_DEFAULT_PATH: window.Mettle_Template_LOAD_BY_URL_DEFAULT_PATH || "",
        BY_URL_DEFAULT_EXTENSION: window.Mettle_Template_LOAD_BY_URL_DEFAULT_EXTENSION || ".hbs"
    };

}(Mettle, window));