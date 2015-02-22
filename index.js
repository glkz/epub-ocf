var fs = require('fs');
var DirectoryContainer = require('./lib/Directory');
var ZipContainer = require('./lib/Zip');
var HttpContainer = require('./lib/Http');

var open = function(uri, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (uri.indexOf('http://') === 0 || uri.indexOf('https://') === 0) {
    setTimeout(function() {
      cb(null, http(uri, options));
    }, 0);

    return ;
  }

  fs.stat(uri, function(err, stats) {
    if (err) {
      return cb(err);
    }

    if (stats.isFile()) {
      return cb(null, zip(uri, options));
    }

    if (stats.isDirectory()) {
      return cb(null, dir(uri, options));
    }

    return cb(new Error('No appropriate container handler found for ' + uri));
  });
};

var openSync = function(uri, options) {
  if (uri.indexOf('http://') === 0 || uri.indexOf('https://') === 0) {
    return http(uri, options);
  }

  var stat = fs.statSync(uri);
  if (stat.isDirectory()) {
    return dir(uri, options);
  }

  return zip(uri, options);
};

module.exports = open;
module.exports.openSync = openSync;

var dir = module.exports.dir = function(uri, options) {
  return new DirectoryContainer(uri, options);
};

var zip = module.exports.zip = function(uri, options) {
  return new ZipContainer(uri, options);
};

var http = module.exports.http = function(uri, options) {
  return new HttpContainer(uri, options);
};
