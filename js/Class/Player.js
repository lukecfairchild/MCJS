'use strict';

var Player = new Class( function ( player ) {

	var rawMethods = ( new org.bukkit.entity.Player( {} ) ).getClass().getMethods();

	for ( var i in rawMethods ) {
		var method = rawMethods[ i ].getName().toString();

		if ( !( method in this ) ) {
			this[ method ] = player[ method ];
		}
	}

	for ( var i in this ) {

		if ( typeof this[ i ] === 'function'
		&&   this[ i ].bind ) {

			this[ i ] = this[ i ].bind( player );
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
