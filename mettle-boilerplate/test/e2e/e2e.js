var conf = require('./config.js');
var connect = require('connect');
var asyncblock = require('asyncblock');
var exec = require('child_process').exec;

asyncblock(function (flow) {
    var server = connect.createServer(
        connect.static(conf.config.resourceFolder)
    ).listen(conf.config.serverPort);
    exec("mocha --recursive tests", flow.add());
    var result = flow.wait();
    console.log(result);
    server.close();
});

