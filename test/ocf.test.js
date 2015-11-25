var ocf = require('../');
var should = require('should');

describe('#ocf', function() {
  it('should return Zip container', function() {
    ocf(__dirname + '/fixtures/sample.epub').should.be.instanceof(require('../lib/Zip'));
  });
});

describe('#open', function() {
  it('should return Zip async', function(done) {
    ocf.open(__dirname + '/fixtures/sample.epub', function(err, container) {
      container.should.be.instanceof(require('../lib/Zip'));
      done();
    });
  });

  it('should return Directory async', function(done) {
    ocf.open(__dirname + '/fixtures/sample', function(err, container) {
      container.should.be.instanceof(require('../lib/Directory'));
      done();
    });
  });

  it('should return Http async', function(done) {
    ocf.open('http://my.ebooks.service.org/ebook2/', function(err, container) {
      container.should.be.instanceof(require('../lib/Http'));
      done();
    });
  });
});

describe('# Zip container tests', function() {
  containerTests(ocf.zip(__dirname + '/fixtures/sample.epub'));
});

describe('# Directory container tests', function() {
  containerTests(ocf.dir(__dirname + '/fixtures/sample'));
});

describe('# Http container tests ', function() {
  var server;
  var port = 9981;

  before(function(done) {
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
  });

  describe('http', function() {
    containerTests(ocf.http('http://localhost:' + port));
  });

  after(function() {
    server.close();
  });
});

//
function containerTests(container) {
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
}
