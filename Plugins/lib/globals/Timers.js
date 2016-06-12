'use strict';

var uuid = function () {

	function s4 () {

		return Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 ).substring( 1 );
	};

	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

var Timers = new Class( function () {

	this.private.timers = {};

	MCJS.addCleanupTask( function () {

		for ( var index in this.private.timers ) {
			this.private.timers[ index ].cancel();
		}

		this.private.timers = {};

	}.bind( this ) );
} );

Timers.prototype.clearAllTasks = function () {

	for ( var index in this.private.timers ) {
		this.private.timers[ index ].cancel();
	}

	this.private.timers = {};
};

Timers.prototype.setTimeout = function ( callback, delayInMillis ) {

	var delay  = Math.ceil( delayInMillis / 50 ) || 1;
	var id     = uuid();
	var timer  = org.bukkit.Bukkit.scheduler.runTaskLater( MCJS.getInstance(), function () {

		delete this.private.timers[ id ];
		callback.call( {
			'cancel' : function () {

				timer.cancel();
			}
		} );
	}.bind( this ), delay );

	this.private.timers[ id ] = timer;

	return {
		'cancel' : function () {

			delete this.private.timers[ id ];
			timer.cancel();
		}.bind( this )
	};
};

Timers.prototype.setInterval = function ( callback, intervalInMillis ) {

	var delay  = Math.ceil( intervalInMillis / 50 ) || 1;
	var id     = uuid();
	var timer  = org.bukkit.Bukkit.scheduler.runTaskTimer( MCJS.getInstance(), function () {

		callback.call( {
			'cancel' : function () {

				delete this.private.timers[ id ];
				timer.cancel();
			}.bind( this )
		} );
	}.bind( this ), delay, delay );

	this.private.timers[ id ] = timer;

	return {
		'cancel' : function () {

			delete this.private.timers[ id ];
			timer.cancel();
		}.bind( this )
	};
};

module.exports = new Timers();
