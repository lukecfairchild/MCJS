'use strict';

var Timer  = Java.type( 'java.util.Timer' );
var Timers = [];
function clearTask ( timer ) {

	timer.cancel();
};
function setInterval () {

	var timer   = new Timer( 'setTimerRequest', true );
	var handler = arguments[ 0 ] || function(){};
	var ms      = arguments[ 1 ];
	var closure = function () {

		handler.call( timer );
	};

	var delay    = ms || 0;
	var interval = ms || 0;

	if ( interval > 0 ) {
		timer.schedule( closure, delay, interval );

	} else {
		timer.schedule( closure, delay );
	}

	Timers.push( timer );
	return { 
		cancel: function(){
			Timers.remove( timer );
			timer.cancel();
		}
	};
};
function setTimeout () {

	var timer   = new Timer( 'setTimerRequest', true );
	var handler = arguments[ 0 ] || function(){};
	var ms      = arguments[ 1 ];
	var closure = function () {

		handler.call( timer );
	};

	var delay    = ms || 0;
	var interval = 0  || 0;

	if ( interval > 0 ) {
		timer.schedule( closure, delay, interval );

	} else {
		timer.schedule( closure, delay );
	}

	Timers.push( timer );
	return { 
		'cancel' : function () {

			Timers.remove( timer );
			timer.cancel();
		}
	};
};

var CH = require( './js/CH.js' );
var bind = require( './js/Events.js' );


print( JSON.stringify( CH.ploc( 'kookster' ) ) );

bind( 'player.PlayerChatEvent', function ( event ) {

	print( 'EVENT!!!' );
	print( JSON.stringify( event ) );
} );