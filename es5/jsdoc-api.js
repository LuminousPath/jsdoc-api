'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var walkBack = require('walk-back');
var spawnSync = require('child_process').spawnSync;
var path = require('path');
var fs = require('fs');
var getTempPath = require('temp-path');
var toSpawnArgs = require('object-to-spawn-args');
var defer = require('defer-promise');
var arrayify = require('array-back');

exports.explainSync = explainSync;
exports.renderSync = renderSync;

var jsdocPath = walkBack(path.join(__dirname, '..'), path.join('node_modules', 'jsdoc-75lb', 'jsdoc.js'));

function explainSync(files, options) {
  var args = ['-X'].concat(arrayify(files));
  var result = spawnSync(jsdocPath, args);
  return JSON.parse(result.stdout);
}

explainSync.source = function explainSyncSource(source) {
  var tempFile = new TempFile(source);
  var args = ['-X'].concat(tempFile.path);
  var result = spawnSync(jsdocPath, args);
  tempFile.delete();
  return JSON.parse(result.stdout);
};

function renderSync(files, options) {
  var args = toSpawnArgs(options).concat(arrayify(files));
  spawnSync(jsdocPath, args);
}

renderSync.source = function renderSyncSource(source, options) {
  var tempFile = new TempFile(source);
  var args = toSpawnArgs(options).concat(tempFile.path);
  spawnSync(jsdocPath, args);
  tempFile.delete();
};

var TempFile = (function () {
  function TempFile(source) {
    _classCallCheck(this, TempFile);

    this.path = getTempPath() + '.js';
    fs.writeFileSync(this.path, source);
  }

  _createClass(TempFile, [{
    key: 'delete',
    value: function _delete() {
      fs.unlinkSync(this.path);
    }
  }]);

  return TempFile;
})();