'use strict';

var OfflinePlayer = new Class( function ( bukkitObject ) {

	var rawMethods = bukkitObject.getClass().getMethods();

	for ( var i in this ) {
		this[ i ] = this[ i ].bind( bukkitObject );
	}

	for ( var i in rawMethods ) {
		var method = rawMethods[ i ].getName().toString();

		if ( !( method in this ) ) {
			this[ method ] = function ( /* arguments */ ) {

				var args = [];

				for ( var key in arguments ) {
					args.push( 'arguments[ "' + key + '" ]' );
				}

				return eval( 'bukkitObject[ this ]( ' + args.join() + ' );' );
			}.bind( method );
		}
	}
} );

OfflinePlayer.prototype.getBedSpawnLocation = function () {

	var Location = require( './Location.js' );

	return new Location( this.getBedSpawnLocation() );
};

OfflinePlayer.prototype.getPlayer = function () {

	var returns = null;

	var Player = require( './Player.js' );

	var bukkitPlayerObject =  this.getPlayer();

	if ( bukkitPlayerObject ) {
		returns = new Player( bukkitPlayerObject );
	}

	return returns;
};

module.exports = OfflinePlayer;