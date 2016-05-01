'use strict';

var Console = function () {

	var rawMethods = ( new org.bukkit.entity.Player( {} ) ).getClass().getMethods();
	var methods    = [];

	for ( var i in rawMethods ) {
		var method = rawMethods[ i ].getName().toString();

		if ( !( method in this ) ) {
			this[ method ] = function () {};
		}
	}
};

Console.prototype.sendMessage = function ( message ) {

	console.log( message );
};

module.exports = new Console();
