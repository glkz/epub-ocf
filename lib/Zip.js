var AbstractContainer = require('./Abstract');
var util = require('util');
var spawn = require('child_process').spawn;
var path = require('path');

var ZipContainer = function(uri, options) {
  AbstractContainer.apply(this, arguments);
};

util.inherits(ZipContainer, AbstractContainer);

ZipContainer.prototype.createReadStream = function(entryPath) {
  var normalizedPath = entryPath.replace(/^\/+/, '');
  var proc = spawn('unzip', ['-p', this.uri, normalizedPath]);

  return proc.stdout;
};

module.exports = ZipContainer;
