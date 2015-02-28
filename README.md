# epub-ocf

[![Build Status](https://travis-ci.org/glkz/epub-ocf.svg)](https://travis-ci.org/glkz/epub-ocf)

Simple node.js library to read entries inside an epub container.


## Installation
```sh
$ npm install --save epub-ocf
```


## API

### Creating container object

```javascript
var ocf = require('epub-ocf');
var container = ocf('path/to/epub.epub'); // ocf is an alias for ocf.zip
```

You can also create a container object from extracted epub directories.

```javascript
var container = ocf.dir('path/to/extracted/epub/directory/');
```

Or, epub directories served via http:

```javascript
var container = ocf.http('http://my.ebooks.service.org/ebook2/');
```


**epub-ocf** library can also guess which container method to use by examining the given uri.

```javascript
// a Zip container
ocf.open('path/to/book.epub', function(err, container) {}); 

// a Directory container
ocf.open('path/to/book-dir', function(err, container) {});

// a Http container
ocf.open('http://my.ebooks.service.org/ebook2/', function(err, container) {});
```

There is also a ```sync``` version of ```open``` function.
```javascript
var container = ocf.openSync('your container uri');
```


### Container methods

All container objects have ```readEntry```, ```createReadStream``` and ```rootfiles``` methods.

#### ```container.readEntry(entryPath, cb)```

Returns the contents of entry.

```javascript
container.readEntry('META-INF/container.xml', function(err, content) {
  console.log(content);
});
```


#### ```container.createReadStream(entryPath)```

Creates a readable stream for the entry.
```javascript
var stream = container.createEntryStream('EPUB/images/cover.jpg');
stream.pipe(process.stdout);
```


#### ```container.rootfiles(cb)```

Returns an array of rootfiles by parsing the ```META-INF/container.xml```

```javascript
container.rootfiles(function(err, files) {
  console.log(files); // [ 'EPUB/package.opf' ]
});
```



## Running the tests
```sh
$ git clone https://github.com/glkz/epub-ocf.git
$ cd epub-ocf
$ npm install
$ npm test
```


## License
See the [LICENSE](./LICENSE) file.
