var AbstractContainer = function(uri, options) {
  this.uri = uri;
  this.options = options || {};
};

AbstractContainer.prototype.readEntry = function(entryPath, cb) {
  var rs = this.createReadStream(entryPath);
  var chunks = [];

  rs.on('data', function(chunk) {
    chunks.push(chunk);
  });

  rs.on('end', function() {
    cb(null, chunks.join(''));
  });

  rs.on('error', function(err) {
    cb(err);
  });
};

AbstractContainer.prototype.createReadStream = function(entryPath) {
  throw new Error('Not implemented!');
};

// don't want to introduce an xml parser dependency for just this.
// so we are using regex for now.
AbstractContainer.prototype.rootfiles = function(cb) {
  this.readEntry('/META-INF/container.xml', function(err, containerxml) {
    if (err) {
      return cb(err);
    }

    var rootfiles = [];
    var regex = /\bfull\-path\s*=\s*"([^"]*)"/g;
    var match;

    while (match = regex.exec(containerxml)) {
      rootfiles.push(match[1]);
    }

    cb(null, rootfiles);
  });
};

module.exports = AbstractContainer;
