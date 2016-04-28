'use strict';

var Script = function () {};

Script.prototype.loadTime = ( new Date() ).getTime();

module.exports.Script = new Script();
