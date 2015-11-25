'use strict';

var Require = load( PATH + '/js/require.js' );
var require = Require( './' , [ 'libpath1', 'libpath2' ] );

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

if ( !Object.prototype.splice ) {
	Object.defineProperty( Object, 'splice', {
		'value' : function () {

			return [].splice.call( this, arguments[ 0 ], arguments[ 1 ] );
		},
		'enumerable' : false
	} );
}

if ( !Object.prototype.slice ) {
	Object.defineProperty( Object, 'slice', {
		'value' : function () {

			return [].slice.call( this, arguments[ 0 ], arguments[ 1 ] );
		},
		'enumerable' : false
	} );
}

require( PATH + './main.js' );
