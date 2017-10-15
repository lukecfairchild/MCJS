'use strict';


var Timers = new Class( function () {

	this.intervals = {};
	this.timeouts  = {};

	MCJS.addCleanupTask( function () {

		this.clearAllTasks();

	}.bind( this ) );

	this.generateID = function () {

		var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {

			var r = Math.random() * 16 | 0;
			var v = c === 'x' ? r : r & 0x3 | 0x8;

			return v.toString( 16 );
		} );

		return uuid;
	};
} );


/**
 * Clears all currently set timeouts and intervals
 * @global
 * @example
 * clearAllTasks();
 */

Timers.prototype.clearAllTasks = function () {

	for ( var index in this.intervals ) {
		this.intervals[ index ].cancel();
	}

	this.intervals = {};

	for ( var index in this.timeouts ) {
		this.timeouts[ index ].cancel();
	}

	this.timeouts = {};
};


/**
 * Function for causing a callback function to execute after a delay.
 * @global
 * @param {Function} callback - Function to be ran after delay period.
 * @param {Number} delay - How often then callback should be ran in milliseconds.
 * @return {TimeoutObject}
 * @example
 * var timeout = setTimeout( function () {
 *
 * 	doStuff();
 * }, 1000 );
 */

Timers.prototype.setTimeout = function ( callback, delayInMillis ) {

	var delay  = Math.ceil( delayInMillis / 50 ) || 1;
	var id     = this.generateID();
	var timeout  = org.bukkit.Bukkit.scheduler.runTaskLater( MCJS.getInstance(), function () {

		delete this.timeouts[ id ];

		callback();
	}.bind( this ), delay );

	this.timeouts[ id ] = timeout;

	return {
		'type'   : 'timeout',
		'cancel' : function () {

			delete this.timeouts[ id ];
			timeout.cancel();
		}.bind( this )
	};
};


/**
 * Function for causing a callback function to execute repeatedly after a delay.
 * @global
 * @param {Function} callback - Function to be ran every time after the repeating delay.
 * @param {Number} delay - How often then callback should be ran in milliseconds.
 * @return {IntervalObject}
 * @example
 * var interval = setInterval( function () {
 *
 * 	cancelTimeout( interval );
 * }, 1000 );
 *
 * setInterval( function ( interval ) {
 *
 * 	cancelTimeout( interval );
 * }, 1000 );
 *
 * setInterval( function ( interval ) {
 *
 * 	interval.cancel();
 * }, 1000 );
 */

Timers.prototype.setInterval = function ( callback, intervalInMillis ) {

	var delay  = Math.ceil( intervalInMillis / 50 ) || 1;
	var id     = this.generateID();
	var interval  = org.bukkit.Bukkit.scheduler.runTaskTimer( MCJS.getInstance(), function () {

		callback( {
			'type'   : 'interval',
			'cancel' : function () {

				delete this.intervals[ id ];

				interval.cancel();
			}.bind( this )
		} );
	}.bind( this ), delay, delay );

	this.intervals[ id ] = interval;

	return {
		'type'   : 'interval',
		'cancel' : function () {

			delete this.intervals[ id ];

			interval.cancel();
		}.bind( this )
	};
};


/**
 * Function for terminating a timeout before it executes.
 * @global
 * @param {TimeoutObject} timeout - Timeout to terminate.
 * @example
 * clearTimeout( timeout );
 */

Timers.prototype.clearTimeout = function ( timeout ) {

	if ( typeof timeout === 'object'
	&&   timeout.type === 'timeout'
	&&   typeof timeout.cancel === 'function' ) {

		timeout.cancel();
	}
};


/**
 * Function for terminating a interval.
 * @global
 * @param {IntervalObject} interval - Interval to terminate.
 * @example
 * clearInterval( interval );
 */

Timers.prototype.clearInterval = function ( timeout ) {

	if ( typeof timeout === 'object'
	&&   timeout.type === 'interval'
	&&   typeof timeout.cancel === 'function' ) {

		timeout.cancel();
	}
};


module.exports = new Timers();
