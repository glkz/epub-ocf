var AbstractContainer = require('./abstract');
var util = require('util');
var url = require('url');
var extend = require('extend');
var stream = require('stream');

var HttpResponseStream = function(request, opts) {
  var self = this;
  stream.Readable.call(self);
  self.pause();

  var req = request(opts, function(res) {
    res.on('readable', function() {
      self.resume();

      while (null !== (chunk = res.read())) {
        self.push(chunk);
      }
    });

    res.on('end', function() {
      self.push(null);
    });

    res.on('error', function(err) {
      self.emit('error', err);
    });

  });

  req.on('error', function(err) {
    self.emit('error', err);
  });

  req.end();
};

util.inherits(HttpResponseStream, stream.Readable);

HttpResponseStream.prototype._read = function() {};

////

var HttpContainer = function(uri, options) {
  uri = uri.replace(/\/$/, '');
  AbstractContainer.apply(this, arguments);
};

util.inherits(HttpContainer, AbstractContainer);

HttpContainer.prototype.createReadStream = function(entryPath) {
  var entryUrl = url.parse(this.uri + '/' + entryPath.replace(/^\/+/, ''));
  var protocol = entryUrl.protocol.replace(':', '');

  var options = extend(true, {}, this.options, entryUrl);

  return new HttpResponseStream(require(protocol).request, options);
};

module.exports = function(uri, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  setImmediate(function() {
    var cont = new HttpContainer(uri, options);
    cb(null, cont);
  });
};

module.exports.HttpContainer = HttpContainer;
