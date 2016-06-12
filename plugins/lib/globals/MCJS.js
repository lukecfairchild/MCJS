'use strict';

var MCJS = new Class( function () {

	this.private.loadTime = ( new Date() ).getTime();
	this.private.instance = org.bukkit.Bukkit.getPluginManager().getPlugin( 'MCJS' );
} );

MCJS.prototype.getLoadTime = function () {

	return this.private.loadTime;
};

MCJS.prototype.getInstance = function () {

	return this.private.instance;
};

module.exports.MCJS = new MCJS();
