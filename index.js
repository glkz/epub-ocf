var fs = require('fs');

var open = function(uri, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (uri.indexOf('http://') === 0 || uri.indexOf('https://') === 0) {
    setTimeout(function() {
      http(uri, options, cb);
    }, 0);

    return ;
  }

  fs.stat(uri, function(err, stats) {
    if (err) {
      return cb(err);
    }

    if (stats.isFile()) {
      return zip(uri, options, cb);
    }

    if (stats.isDirectory()) {
      return dir(uri, options, cb);
    }

    return cb(new Error('No appropriate container handler found for ' + uri));
  });
};

var zip = require('./lib/zip');
var dir = require('./lib/dir');
var http = require('./lib/http');

module.exports = zip;
module.exports.open = open;

module.exports.zip = zip;
module.exports.dir = dir;
module.exports.http = http;
