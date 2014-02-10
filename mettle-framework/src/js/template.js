(function (Mettle, $) {
    "use strict";

    Mettle.templateEngine = {
        getById: getById,
        getByCSSSelector: getByCSSSelector,
        getByURL: getByURL,
        getByString: getByString,
        process: process,
        safeString: safeString,
        remove: remove
    };

    function getByURL(url, onSuccess) {
        $.get(url, function (templateHTML) {
            onSuccess(getCompiledTemplate(templateHTML));
        });
    }

    function safeString(template) {
        return new Handlebars.SafeString(template);
    }

    function getCompiledTemplate(template) {
        return Handlebars.compile(template);
    }

    function remove(id) {
        var $el = $("#" + id);
        $el.remove();
    }

    function getByString(string) {
        return getCompiledTemplate(string);
    }

    function getById(id) {
        var $el = $("#" + id);
        var template = $el.html();
        $el.remove();
        if (!template) {
            throw new Error("Template id: " + id + ", not found!!");
        } else {
            return getCompiledTemplate(template);
        }
    }

    function getByCSSSelector(cssSelector) {
        var template = $(cssSelector).html();
        if (!template) {
            throw new Error("Template selector: " + cssSelector + ", not matched any!!");
        } else {
            return getCompiledTemplate(template);
        }
    }

    function process(template, templateData) {
        return template(templateData);
    }

}(Mettle, Mettle.DOM));