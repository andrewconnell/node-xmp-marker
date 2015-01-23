xmp-marker
==========
Extracts marker objects from the [Adobe Extensible Metadata Platform](http://www.adobe.com/products/xmp.html) (XMP<sup>TM</sup>) file type.

Usage
-----
````javascript
var XmpMarker = require('xmp-marker');
var xmpMarker = new XmpMarker();

var xmpFile = __dirname +'/test/samples/three-markers.xmp';
xmpMarker.getMarkers(xmpFile)
  .then(function(markers){
      markers.forEach(function(marker, index){
          console.log('marker #' + index);
          console.log('  content: ' + marker.content);
          console.log('  timecode: ' + marker.timecode);
        });
    });
````

For more usage details, see the tests found in the `/test` folder. To execute the tests, install [Mocha](https://www.npmjs.com/package/mocha) globally...

````
npm install mocha -g
````

... then run from the command line using NPM...

````
npm test
````

... or mocha directly from within the root of the source of this repo:
````
mocha
````
