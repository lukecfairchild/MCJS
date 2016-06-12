'use strict';

var MCJS = new Class( function () {

	this.instance = org.bukkit.Bukkit.getPluginManager().getPlugin( 'MCJS' );
} );

MCJS.prototype.getInstance = function () {

	return this.instance;
};

MCJS.prototype.reload = function () {

	this.instance.reload()
};

module.exports = new MCJS();
