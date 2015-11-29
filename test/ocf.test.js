var ocf = require('../');
var should = require('should');

describe('#ocf', function() {
  it('should return Zip container', function(done) {
    ocf(__dirname + '/fixtures/sample.epub', {}, function(err, cont) {
      cont.should.be.instanceof(require('../lib/zip').ZipContainer);
      done();
    });
  });
});

describe('#open', function() {
  it('should return Zip', function(done) {
    ocf.open(__dirname + '/fixtures/sample.epub', function(err, container) {
      container.should.be.instanceof(require('../lib/zip').ZipContainer);
      done();
    });
  });

  it('should return Dir', function(done) {
    ocf.open(__dirname + '/fixtures/sample', function(err, container) {
      container.should.be.instanceof(require('../lib/dir').DirContainer);
      done();
    });
  });

  it('should return Http', function(done) {
    ocf.open('http://my.ebooks.service.org/ebook2/', function(err, container) {
      container.should.be.instanceof(require('../lib/http').HttpContainer);
      done();
    });
  });
});

ocf.zip(__dirname + '/fixtures/sample.epub', {}, function(err, container) {
  containerTests('# Zip container tests', container);
});

ocf.dir(__dirname + '/fixtures/sample', {}, function(err, container) {
  containerTests('# Dir container tests', container);
});


var server;
var port = 9981;

(function() {
  var container = new ocf.http.HttpContainer('http://localhost:' + port, {});

  var beforeFn = function(done) {
    var nodeStatic = require('node-static');
    var fileServer = new nodeStatic.Server(__dirname + '/fixtures/sample');

    server = require('http').createServer(function(request, response) {
      request.addListener('end', function() {
        fileServer.serve(request, response);
      }).resume();
    });

    server.on('listening', function() {
      done();
    });
    server.listen(port);
  };

  var afterFn = function() {
    server.close();
  };

  containerTests('# Http container tests', container, beforeFn, afterFn);
})();


//
function containerTests(title, container, beforeFn, afterFn) {
  describe(title, function() {
    if (beforeFn) {
      before(beforeFn);
    }

    describe('#rootfiles', function() {
      it('should return list of rootfiles', function(done) {
        container.rootfiles(function(err, files) {
          files.should.be.an.Array;
          files.should.containEql('EPUB/package.opf');
          done();
        });
      });
    });

    describe('#readEntry', function() {
      it('should return xml', function(done) {
        container.readEntry('/EPUB/package.opf', function(err, content) {
          content.indexOf('<?xml version="1.0" encoding="utf-8" standalone="no"?>').should.be.eql(0);
          done();
        });
      });
    });

    describe('#createReadStream', function() {
      it('should return readable stream', function() {
        var stream = container.createReadStream('META-INF/container.xml');
        stream.should.be.instanceof(require('stream').Readable);
      });

      it('listen data event', function(done) {
        var stream = container.createReadStream('META-INF/container.xml');
        stream.should.be.instanceof(require('stream').Readable);

        stream.on('data', function(data) {
          data.toString().indexOf('<?xml version="1.0"').should.be.eql(0);
          done();
        });
      });
    });

    if (afterFn) {
      after(afterFn);
    }
  });
}
