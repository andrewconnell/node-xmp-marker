'use strict';

var path = require('path');
var chai = require('chai'),
    expect = chai.expect;
var XMPMarker = require('./../lib/xmp-marker')

describe('XMPMarker', function () {

  var xmpmarker = {},
      baseSamplePath = '',
      pathToXmp = '';

  before(function (done) {
    xmpmarker = new XMPMarker();

    baseSamplePath = path.join(__dirname, 'samples');

    done();
  });

  describe('getMarkers()', function () {

    it('will fail on bad file path', function (done) {
      pathToXmp = path.join(__dirname, 'non-existent-file.xmp');

      xmpmarker.getMarkers(pathToXmp)
          .then(function (markers) {
            expect(markers).to.be.equal(undefined);
            done();
          })
          .catch(function (error) {
            expect(error).to.not.be.equal(undefined);
            done();
          });
    });

    describe('zero-markers', function () {
      beforeEach(function (done) {
        pathToXmp = path.join(baseSamplePath, 'zero-markers.xmp');

        done();

      });

      it('will return zero markers', function (done) {
        xmpmarker.getMarkers(pathToXmp)
            .then(function (results) {

              // validate got a response
              expect(results).to.not.be.equal(undefined);

              // validate no markers extracted
              expect(results.length).to.be.equal(0);

              done();
            }).catch(function (results) {
              // if got here, failure
              done(results);
            });
      });
    }); // describe 'zero-markers'

    describe('one-marker', function () {
      beforeEach(function (done) {
        pathToXmp = path.join(baseSamplePath, 'one-marker.xmp');

        done();

      });

      it('will return one marker', function (done) {
        xmpmarker.getMarkers(pathToXmp)
            .then(function (results) {

              // validate got a response
              expect(results).to.not.be.equal(undefined);

              // validate no markers extracted
              expect(results.length).to.be.equal(1);

              done();
            }).catch(function (results) {
              // if got here, failure
              done(results);
            });
      });

      it('will return valid marker object', function (done) {
        xmpmarker.getMarkers(pathToXmp)
            .then(function (results) {

              // validate got a response
              expect(results).to.not.be.equal(undefined);

              // validate properties on response object
              expect(results[0].content).to.not.be.equal(undefined);
              expect(results[0].timecode).to.not.be.equal(undefined);

              done();
            }).catch(function (results) {
              // if got here, failure
              done(results);
            });
      });

      it('will return valid marker contents', function (done) {
        xmpmarker.getMarkers(pathToXmp)
            .then(function (results) {

              // validate got a response
              expect(results).to.not.be.equal(undefined);

              // validate properties on response object
              expect(results[0].content).to.be.equal('only timecode @00:01:18:12');

              done();
            }).catch(function (results) {
              // if got here, failure
              done(results);
            });
      });

      it('will return correct marker timecode', function (done) {
        xmpmarker.getMarkers(pathToXmp)
            .then(function (results) {

              // validate got a response
              expect(results).to.not.be.equal(undefined);

              // validate properties on response object
              expect(results[0].timecode).to.be.equal('01:18');

              done();
            }).catch(function (results) {
              // if got here, failure
              done(results);
            });
      });

    }); // describe 'one-marker'

    describe('three-marker', function () {
      beforeEach(function (done) {
        pathToXmp = path.join(baseSamplePath, 'three-markers.xmp');

        done();

      });

      it('will return three markers', function (done) {
        xmpmarker.getMarkers(pathToXmp)
            .then(function (results) {

              // validate got a response
              expect(results).to.not.be.equal(undefined);

              // validate no markers extracted
              expect(results.length).to.be.equal(3);

              done();
            }).catch(function (results) {
              // if got here, failure
              done(results);
            });
      });

      it('will return valid marker object', function (done) {
        xmpmarker.getMarkers(pathToXmp)
            .then(function (results) {

              // validate got a response
              expect(results).to.not.be.equal(undefined);

              // validate properties on response object
              results.forEach(function(element){
                expect(element.content).to.not.be.equal(undefined);
                expect(element.timecode).to.not.be.equal(undefined);
              });

              done();
            }).catch(function (results) {
              // if got here, failure
              done(results);
            });
      });

      it('will return valid marker contents', function (done) {
        xmpmarker.getMarkers(pathToXmp)
            .then(function (results) {

              // validate got a response
              expect(results).to.not.be.equal(undefined);

              // validate properties on response object
              expect(results[0].content).to.be.equal('first timecode @00:00:33:14');
              expect(results[1].content).to.be.equal('second timecode @ 00:01:38:23');
              expect(results[2].content).to.be.equal('third timecode\nwith a linebreak\nand another linebreak');

              done();
            }).catch(function (results) {
              // if got here, failure
              done(results);
            });
      });

      it('will return correct marker timecode', function (done) {
        xmpmarker.getMarkers(pathToXmp)
            .then(function (results) {

              // validate got a response
              expect(results).to.not.be.equal(undefined);

              // validate properties on response object
              expect(results[0].timecode).to.be.equal('00:33');
              expect(results[1].timecode).to.be.equal('01:38');
              expect(results[2].timecode).to.be.equal('02:29');

              done();
            }).catch(function (results) {
              // if got here, failure
              done(results);
            });
      });

    }); // describe 'one-marker'

  });
});