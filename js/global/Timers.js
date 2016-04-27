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

Timers.prototype.clearAllTasks = function () {

	for ( var index in timers ) {
		timers[ index ].cancel();
	}

	timers = {};
};

Timers.prototype.setTimeout = function ( callback, delayInMillis ) {

	var delay  = Math.ceil( delayInMillis / 50 ) || 1;
	var id     = uuid();
	var timer  = org.bukkit.Bukkit.scheduler.runTaskLater( __plugin, function () {

		var lastCHReload = com.laytonsmith.core.Globals.GetGlobalConstruct( 'lastReload' ).getInt();

		if ( lastCHReload > loadTime ) {
			Cleanup.trigger();

		} else {
			delete timers[ id ];
			callback.call( {
				'cancel' : function () {

					timer.cancel();
				}
			} );
		}
	}, delay );

	timers[ id ] = timer;

	return {
		'cancel' : function () {

			delete timers[ id ];
			timer.cancel();
		}
	};
};
Timers.prototype.setInterval = function ( callback, intervalInMillis ) {

	var delay  = Math.ceil( intervalInMillis / 50 ) || 1;
	var id     = uuid();
	var timer  = org.bukkit.Bukkit.scheduler.runTaskTimer( __plugin, function () {

		var lastCHReload = com.laytonsmith.core.Globals.GetGlobalConstruct( 'lastReload' ).getInt();

		if ( lastCHReload > loadTime ) {
			Cleanup.trigger();

		} else {
			callback.call( {
				'cancel' : function () {

					delete timers[ id ];
					timer.cancel();
				}
			} );
		}
	}, delay, delay );

	timers[ id ] = timer;

	return {
		'cancel' : function () {

			delete timers[ id ];
			timer.cancel();
		}
	};
};

var TimerObject = new Timers();

module.exports  = TimerObject;

Cleanup.add( TimerObject.clearAllTasks );
