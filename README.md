Mettle [![Build Status](https://api.travis-ci.org/manishshanker/Mettle.png?branch=master)](https://travis-ci.org/manishshanker/Mettle)  
======

Mettle - MVC Framework for HTML5 Web Application

[Controller](https://github.com/manishshanker/Mettle/blob/master/mettle-framework/src/js/baseClass/Controller.js), [Service](https://github.com/manishshanker/Mettle/blob/master/mettle-framework/src/js/baseClass/Service.js), [View](https://github.com/manishshanker/Mettle/blob/master/mettle-framework/src/js/baseClass/View.js)

#mettle-boilerplate 
&#10004;&nbsp;HTML5&nbsp; 
&#10004;&nbsp;Standards-compliant&nbsp;
&#10004;&nbsp;Localisation&nbsp; 
&#10004;&nbsp;Integrated Build&nbsp;
&#10004;&nbsp;Model-View-Controller&nbsp;
&#10004;&nbsp;Modular&nbsp;
&#10004;&nbsp;E2E&nbsp;Testing&nbsp;
&#10004;&nbsp;Unit&nbsp;Testing&nbsp;
&#10004;&nbsp;Clean&nbsp;Code&nbsp;
&#10004;&nbsp;JSLint,&nbsp;W3C&nbsp;

[Controller sample](https://github.com/manishshanker/Mettle/blob/master/mettle-boilerplate/src/lib/js/app/modules/News/News.controller.js), [Service sample](https://github.com/manishshanker/Mettle/blob/master/mettle-boilerplate/src/lib/js/app/modules/News/controls/newsDetail/NewsDetail.service.js), [View sample](https://github.com/manishshanker/Mettle/blob/master/mettle-boilerplate/src/lib/js/app/modules/News/controls/newsList/NewsList.view.js), [Unit test sample](https://github.com/manishshanker/Mettle/blob/master/mettle-boilerplate/test/unit-karma/tests/modules/News/News.controller.test.js), [E2E test sample](https://github.com/manishshanker/Mettle/blob/master/mettle-boilerplate/test/e2e/tests/pageLoad.test.js)

##Directory layout

    build/
      jar/              --> ant dependencies
      build.xml         --> ant build file
    src/                --> all of the files to be used in production
      lib/              --> all library resource js, css, templates, vendor libs, etc.
        css/            --> css files
          module.css    --> default stylesheet
        img/            --> image files
        js/
          app/          --> app specific code
            i18n/       --> localised string resource
            modules/    --> all module code
            appCache.js --> for handling HTML5 app cache
            main.js     --> main file where execution begins
            config.js   --> holds the namespace for the project and other global configs
            serviceURLs --> holds list of all urls required by modules
          vendor/
        templates/      --> holds all templates, default handlebars
        index.html      --> app SPA file (the main html file of the app)
    test/
      e2e/              --> e2e tests, uses node, mocha, selenium-webdriverjs
        tests/          --> contains all tests file
        config.js       --> configuration file for e2e tests
        e2e.js          --> main runner file, starts a server, runs the test "node e2e"
      mockServices/     --> holds mock services for various module
      unit/             --> standalone unit tests, using mocha
        config.js       --> config file for test
        suite.js        --> list of all test files to execute
        tests/          --> all unit tests
      unit-karma/       --> karma unit tests, includes test coverage
        karma.conf.js   --> karma config
          tests/        --> all tests
    package.json        --> use "npm install" to download and install all dev dependencies

##Setup/Build/Test/Run

###Dependency
NodeJS, ANT

###Install:
    cd <project-folder>
    npm install

###Build: (generates output in  `out` folder)
    cd <project-folder>/build
    ant

###Running e2e tests:
    cd <project--folder>/test/e2e
    node e2e
*Ensure config.js points to correct baseURL, serverPort and resourceFolder*

###Running unit tests:
    cd <project-folder>/test/unit
    karma start karma.conf.js
*WebStorm IDE: Instead of commandline, right click on karma.conf.js and click Run*

---

###Teamcity Integration
    Set env variable in teamcity: e.g. MacOS X- env.PATH, env.PHANTOMJS_BIN

####UNIT Tests
    karma start karma.conf.js --single-run --reporters teamcity,coverage
*Create a new build with above command line*

####E2E Tests
    node e2e
*Create a new build with above command line*

---

## License

Copyright 2014 Manish Shanker

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
