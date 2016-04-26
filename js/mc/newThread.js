'use strict';

var NewThread = function () {};

NewThread.prototype.setTimeout = function ( handler ) {

	var javaTimer = Java.type( 'java.util.Timer' );
	var timer     = new javaTimer( 'setTimerRequest', true );

	timer.schedule( handler, 0 );
};

module.exports = new NewThread();
