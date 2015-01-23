'use strict';

var Q = require('q');
var fs = require('fs');
var xmldom = require('xmldom').DOMParser,
    xpath = require('xpath');


// modified select object for using namespaces found within XMP file
var xPathSelect = xpath.useNamespaces({
  "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  "xmpDM": "http://ns.adobe.com/xmp/1.0/DynamicMedia/"
});

// convert node callback => promises
var readFile = Q.denodeify(fs.readFile);

/**
 * Takes the subject and pads it with leading zeros based on the target length.
 *
 * @param {integer} targetLength  Total length of the padded string.
 * @param {integer} subject       Number to pad with zeros.
 */
function padLeadingZeros(targetLength, subject) {
  // build string of all zeros
  var zeros = '';
  for (var index = 0; index < targetLength; index++) {
    zeros = zeros + '0';
  }

  return (zeros + (subject).toString()).slice(-zeros.length);
}

/**
 * Gets the timecode string in the format of 00:00.
 *
 * @param {number}    time      Time, scale defined by framerate.
 * @param {number}    framerate Framerate as a number for the clip.
 * @returns {string}            Formatted timecode as MM:SS.
 */
function getTimecode(time, framerate) {
  var timecodeInSeconds = Math.floor(parseInt(time) * (1001 / (framerate * 1000)));
  var timecodeInMinutes = Math.floor(timecodeInSeconds / 60);
  timecodeInSeconds = timecodeInSeconds % 60;
  var timecodeResult = padLeadingZeros(2, timecodeInMinutes) + ':' + padLeadingZeros(2, timecodeInSeconds);
  return timecodeResult;
}

/**
 * Extract the framerate of the clip from the specified Adobe XMP file.s
 * @param {string}          xmpFile     Fully qualified path to the Adobe XMP file
 * @returns {number}                    The framerate as a number (likely decimal like 15.000000 or 30.000000).
 */
function extractFramerate(xmlDoc) {
  return xPathSelect('//rdf:Description/xmpDM:videoFrameRate/text()', xmlDoc)[0].nodeValue;
}

/**
 * Extracts all markers from the specified Adobe XMP file.
 *
 * @param {document}          xmlDoc    Parsed XMP file as XML document.
 * @returns {Q.Promise<Array<object>>}  Promise containing array of markers.
 */
function extractMarkers(xmlDoc) {
  return xPathSelect('//xmpDM:markers/rdf:Seq/rdf:li', xmlDoc);
}

/**
 * Read the file at the provided path, clean up line endings & load as XML document.
 *
 * @param {string}        xmpFile     Fully qualified path to XMP file.
 * @returns {Q.Promise<document>}     XML document.
 */
function getXmpAsXmlDocument(xmpFile) {
  var deferred = Q.defer();

  // read file contents
  readFile(xmpFile, 'utf-8')
      .then(function (fileData) {
        var xml = fileData.substring(0, fileData.length).replace(/&#xD/gi, '&#xA');

        // load xml
        var doc = new xmldom().parseFromString(xml);

        // return the xml document
        deferred.resolve(doc);
      }).catch(function (error) {
        deferred.reject(error);
      });

  return deferred.promise;
}

//////////////////////////////////////////////////////////////////

function XMPMarker() {

  if (!(this instanceof XMPMarker)) {
    return new XMPMarker();
  }

}

XMPMarker.prototype = {
  /**
   * Extracts all markers from Adobe XMP files & returns them within an array.
   *
   * @param {string}  xmpFile             Fully qualified path to the XMP file.
   * @returns {Q.Promise<Array<object>>}  Array of markers.
   */
  getMarkers: function (xmpFile) {
    var deferred = Q.defer(),
        markers = [];

    getXmpAsXmlDocument(xmpFile)
        .then(function (xmlDocument) {
          var frameRate = extractFramerate(xmlDocument);

          var xmpMarkers = extractMarkers(xmlDocument);

          xmpMarkers.forEach(function (marker, index) {
            // extract the timecode & content
            var adobeXmpTimecode = xPathSelect('//xmpDM:startTime/text()', marker)[index].nodeValue;
            var adobeXmpMarker = xPathSelect('//xmpDM:comment/text()', marker)[index].nodeValue;

            // create question object & add to array
            if (adobeXmpMarker) {
              markers.push({
                content: adobeXmpMarker,
                timecode: getTimecode(adobeXmpTimecode, frameRate)
              });
            }
          });

          deferred.resolve(markers);
        }).catch(function (error) {
          deferred.reject(error);
        });

    return deferred.promise;
  }

};

module.exports = XMPMarker;