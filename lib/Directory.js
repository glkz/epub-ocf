var AbstractContainer = require('./Abstract');
var util = require('util');
var fs = require('fs');
var path = require('path');

var DirectoryContainer = function(uri, options) {
  AbstractContainer.apply(this, arguments);
};

util.inherits(DirectoryContainer, AbstractContainer);

DirectoryContainer.prototype.createReadStream = function(entryPath) {
  var normalizedPath = entryPath.replace(/^\/+/, '');
  var file = path.join(this.uri, normalizedPath);
  return fs.createReadStream(file);
};

module.exports = DirectoryContainer;
