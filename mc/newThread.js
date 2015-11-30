
var newThread = function () {};

newThread.prototype.setTimeout = function ( handler ) {

	var javaTimer = Java.type( 'java.util.Timer' );
	var timer     = new javaTimer( 'setTimerRequest', true );

	timer.schedule( handler, 0 );
};