'use strict';

var timers = {};

var uuid = function () {

	function s4 () {

		return Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 ).substring( 1 );
	};

	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

var Timers = function () {
};
Timers.prototype.clearTask = function ( timer ) {

	timer.cancel();
};
Timers.prototype.clearAllTasks = function () {

	for ( var index in timers ) {
		timers[ index ].cancel();
	}

	timers = {};
};
Timers.prototype.setInterval = function () {

	var javaTimer = Java.type( 'java.util.Timer' );
	var timer     = new javaTimer( 'setTimerRequest', true );
	var handler   = arguments[ 0 ] || function () {};
	var delay     = arguments[ 1 ] || 1;
	var id        = uuid();
	var closure   = function () {

		delete timers[ id ];
		handler.call( timer );
	};

	timer.schedule( closure, delay, delay );

	timers[ id ] = timer;

	return { 
		'cancel' : function () {

			delete timers[ id ];
			timer.cancel();
		}
	};
};
Timers.prototype.setTimeout = function () {

	var javaTimer = Java.type( 'java.util.Timer' );
	var timer     = new javaTimer( 'setTimerRequest', true );
	var handler   = arguments[ 0 ] || function () {};
	var delay     = arguments[ 1 ] || 1;
	var id        = uuid();
	var closure   = function () {

		delete timers[ id ];
		handler.call( timer );
	};

	timer.schedule( closure, delay );

	timers[ id ] = timer;

	return { 
		'cancel' : function () {

			delete timers[ id ];
			timer.cancel();
		}
	};
};

var TimersObject = new Timers();

global.setTimeout     = TimersObject.setTimeout;
global.setInterval    = TimersObject.setInterval;
global.clearTask      = TimersObject.clearTask;
global.clearAllTasks  = TimersObject.clearAllTasks;
