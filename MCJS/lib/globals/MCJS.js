'use strict';


/**
 * @function
 */

var MCJS = new Class( function () {

	this.instance = org.bukkit.Bukkit.getPluginManager().getPlugin( 'MCJS' );
} );


/**
 * @implements MCJS
 * @return {Plugin}
 */

MCJS.prototype.getInstance = function () {

	return this.instance;
};


/**
 * @implements MCJS
 */

MCJS.prototype.reload = function () {

	this.instance.reload();
};


/**
 * @implements MCJS
 * @param {Function} task - A callback function to be ran on termination/reload.
 */

MCJS.prototype.addCleanupTask = function ( task ) {

	if ( typeof task === 'function' ) {
		__instance.cleanup.push( task );

	} else {
		throw new error( 'Invalid cleanup task' );
	}
};

module.exports = new MCJS();
