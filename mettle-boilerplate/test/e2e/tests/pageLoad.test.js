var assert = require('assert');
var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var remote = require('selenium-webdriver/remote');
var util = require('../util.js');
test.describe('Page Loads', function () {
    "use strict";

    var driver;

    test.before(function () {
        driver = new webdriver.Builder().
            withCapabilities(webdriver.Capabilities.chrome()).
            build();
    });

    test.it('should redirect to introduction', function () {
        driver.get(util.getURL("/src/index.html"));
        driver.wait(function () {
            return driver.getCurrentUrl().then(function (url) {
                return util.getURL("/src/index.html#/introduction") === url;
            });
        }, 1000);
    });

    test.after(function () {
        driver.quit();
    });

});