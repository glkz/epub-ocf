var AbstractContainer = require('./abstract');
var util = require('util');
var fs = require('fs');
var path = require('path');

var DirContainer = function(uri, options) {
  AbstractContainer.apply(this, arguments);
};

util.inherits(DirContainer, AbstractContainer);

DirContainer.prototype.createReadStream = function(entryPath) {
  var normalizedPath = entryPath.replace(/^\/+/, '');
  var file = path.join(this.uri, normalizedPath);
  return fs.createReadStream(file);
};

module.exports = function(uri, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  setImmediate(function() {
    var cont = new DirContainer(uri, options);
    cb(null, cont);
  });
};

module.exports.DirContainer = DirContainer;
