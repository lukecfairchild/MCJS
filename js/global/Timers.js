'use strict';

var uuid = function () {

	function s4 () {

		return Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 ).substring( 1 );
	};

	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

var Timers = function () {

	var Cleanup = require( '../lib/Cleanup.js' );

	this.timers = {};

	Cleanup.add( function () {

		for ( var index in this.timers ) {
			this.timers[ index ].cancel();
		}

		this.timers = {};

	}.bind( this ) );
};

Timers.prototype.clearAllTasks = function () {

	for ( var index in this.timers ) {
		this.timers[ index ].cancel();
	}

	this.timers = {};
};

Timers.prototype.setTimeout = function ( callback, delayInMillis ) {

	var delay  = Math.ceil( delayInMillis / 50 ) || 1;
	var id     = uuid();
	var timer  = org.bukkit.Bukkit.scheduler.runTaskLater( __plugin, function () {

		var lastCHReload = com.laytonsmith.core.Globals.GetGlobalConstruct( 'lastReload' ).getInt();

		if ( lastCHReload > Script.loadTime ) {
			var Cleanup = require( '../lib/Cleanup.js' );

			Cleanup.trigger();

		} else {
			delete this.timers[ id ];
			callback.call( {
				'cancel' : function () {

					timer.cancel();
				}
			} );
		}
	}.bind( this ), delay );

	this.timers[ id ] = timer;

	return {
		'cancel' : function () {

			delete this.timers[ id ];
			timer.cancel();
		}.bind( this )
	};
};

Timers.prototype.setInterval = function ( callback, intervalInMillis ) {

	var delay  = Math.ceil( intervalInMillis / 50 ) || 1;
	var id     = uuid();
	var timer  = org.bukkit.Bukkit.scheduler.runTaskTimer( __plugin, function () {

		var lastCHReload = com.laytonsmith.core.Globals.GetGlobalConstruct( 'lastReload' ).getInt();

		if ( lastCHReload > Script.loadTime ) {
			var Cleanup = require( '../lib/Cleanup.js' );

			Cleanup.trigger();

		} else {
			callback.call( {
				'cancel' : function () {

					delete this.timers[ id ];
					timer.cancel();
				}.bind( this )
			} );
		}
	}.bind( this ), delay, delay );

	this.timers[ id ] = timer;

	return {
		'cancel' : function () {

			delete this.timers[ id ];
			timer.cancel();
		}.bind( this )
	};
};

module.exports  = new Timers();
