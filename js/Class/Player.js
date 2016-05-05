'use strict';

var Player = new Class( function ( player ) {

	var rawMethods = player.getClass().getMethods();

	for ( var i in this ) {
		this[ i ] = this[ i ].bind( player );
	}

	for ( var i in rawMethods ) {
		var method = rawMethods[ i ].getName().toString();

		if ( !( method in this ) ) {
			this[ method ] = function ( /* arguments */ ) {

				var args = [];

				for ( var key in arguments ) {
					args.push( 'arguments[ \'' + key + '\' ]' );
				}

				return eval( ' player[ this ]( ' + args.join() + ' );' );
			}.bind( method );
		}
	}
} );

Player.prototype.getBedSpawnLocation = function () {

	var Location = require( './Location.js' );

	return new Location( this.getBedSpawnLocation() );
};

Player.prototype.getLocation = function () {

	var Location = require( './Location.js' );

	return new Location( this.getLocation() );
};

module.exports = Player;
