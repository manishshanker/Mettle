var conf = require('./config.js');

exports.getURL = function getURL(path) {
    return conf.config.baseURL + path;
};
