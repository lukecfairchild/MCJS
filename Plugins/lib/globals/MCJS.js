'use strict';

var MCJS = new Class( function () {

	this.instance = org.bukkit.Bukkit.getPluginManager().getPlugin( 'MCJS' );
} );

MCJS.prototype.getInstance = function () {

	return this.instance;
};

MCJS.prototype.reload = function () {

	this.instance.reload();
};

MCJS.prototype.addCleanupTask = function ( task ) {

	if ( typeof task === 'function' ) {
		__instance.cleanup.push( task );

	} else {
		throw new error( 'Invalid cleanup task' );
	}
};

module.exports = new MCJS();
