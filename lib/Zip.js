var AbstractContainer = require('./Abstract');
var util = require('util');
var path = require('path');
var yauzl = require('yauzl');
var stream = require('stream');

var ZipContainer = function(uri, options) {
  AbstractContainer.apply(this, arguments);
};

util.inherits(ZipContainer, AbstractContainer);

ZipContainer.prototype.createReadStream = function(entryPath) {
  entryPath = entryPath.replace(/^\/+/, '');

  var buffered = new stream.PassThrough();
  var entry = this._entries[entryPath];

  if (!entry) {
    setImmediate(function() {
      buffered.emit('error', new Error('entry not found: ' + entryPath));
    });

    return buffered;
  }

  buffered.pause();
  this._zipfile.openReadStream(entry, function(err, stream) {
    if (err) {
      buffered.emit('error', err);
      return;
    }
    buffered.resume();
    stream.pipe(buffered);
  });

  return buffered;
};

module.exports = function(uri, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  yauzl.open(uri, {autoClose: false}, function(err, zipfile) {
    if (err) return cb(err);
    var entries = {};
    zipfile.on('entry', function(entry) {
      entries[entry.fileName] = entry;
    });

    zipfile.on('end', function() {
      var cont = new ZipContainer(uri, options);
      cont._entries = entries;
      cont._zipfile = zipfile;
      cb(null, cont);
    });
  });
};

module.exports.ZipContainer = ZipContainer;
