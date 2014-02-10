// Karma configuration
// Generated on Thu Dec 12 2013 13:03:40 GMT+0000 (GMT)

module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'tests/**/*test.js',
            '../../src/lib/js/vendor/zepto.min.js',
            '../../src/lib/js/vendor/handlebars-v1.1.2.js',
            '../../src/lib/js/vendor/Mettle.min.js',
            '../../src/lib/js/vendor/**/*.js',
            '../../src/lib/js/app/namespace.js',
            '../../src/lib/js/app/serviceURLs.js',
            '../../src/lib/js/app/**/*.js',
            "../mockServices/**/*.js"
        ],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            '../../src/lib/js/app/**/*.js': ['coverage']
        },

        // list of files to exclude
        exclude: [
            '../../src/lib/js/app/main.js'
        ],

        coverageReporter: {
            type: 'teamcity',
            dir: 'coverage/'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress', 'teamcity', 'coverage'],

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['PhantomJS'],
//        browsers: ['Chrome'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
