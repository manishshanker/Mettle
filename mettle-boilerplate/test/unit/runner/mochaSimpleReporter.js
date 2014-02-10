(function() {
    function CustomMochaReport(runner, onReportEnd) {
        onReportEnd = onReportEnd || function() {};
        mocha.reporters.Base.call(this, runner);
        var stats = this.stats;

        runner.on('fail', function (test, err) {
            console.log("failed: " + test.fullTitle() + "' message='" + err.message + "']");
        });

        runner.on('pending', function (test) {
            console.log("ignored: " + test.fullTitle() + "' message='" + err.message + "']");
        });

        runner.on('end', function () {
            if (stats.passes===stats.tests) {
                console.log("SUCCESS: " + stats.passes + " of " + stats.tests + " passed.");
            } else {
                console.log("FAILED: " + stats.failures + " of " + stats.tests + " failed.");
            }
            console.log("Status: " + (stats.passes===stats.tests?"PASSED":"FAILED") + ", Time taken: " + stats.duration + ", " + "Test Execution Finished!");
            onReportEnd();
        });
    }

    mocha.reporters.simpleReporter = CustomMochaReport;
}());
