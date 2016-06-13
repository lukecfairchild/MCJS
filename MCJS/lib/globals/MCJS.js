'use strict';


/**
 * This allows you to handle plugin specific information like reloads and its instance.
 * @namespace
 */

var MCJS = new Class( function () {

	this.private.instance = org.bukkit.Bukkit.getPluginManager().getPlugin( 'MCJS' );
} );


/**
 * This allows you to get the plugin instance of MCJS
 * @implements MCJS
 * @return {Plugin}
 * @example
 * var instance = MCJS.getInstance();
 */

MCJS.prototype.getInstance = function () {

	return this.private.instance;
};


/**
 * This causes MCJS to remove all current events/timers and reload its scripts.
 * @implements MCJS
 * @example
 * MCJS.reload();
 */

MCJS.prototype.reload = function () {

	this.private.instance.reload();
};


/**
 * This adds a task to MCJS to run when it is either disabled or reloaded for cleanup.
 * @implements MCJS
 * @param {Function} task - A callback function to be ran on termination/reload.
 * @example
 * MCJS.addCleanupTask( function () {
 * 
 * 	doStuff();
 * } );
 */

MCJS.prototype.addCleanupTask = function ( task ) {

	if ( typeof task === 'function' ) {
		__instance.cleanup.push( task );

	} else {
		throw new error( 'Invalid cleanup task' );
	}
};

module.exports = new MCJS();
