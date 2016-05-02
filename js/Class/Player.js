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

	var location = this.getBedSpawnLocation();

	return {
		'x'     : Number( location.getX() ),
		'y'     : Number( location.getY() ),
		'z'     : Number( location.getZ() ),
		'yaw'   : Number( location.getYaw() ),
		'pitch' : Number( location.getPitch() ),
		'world' : location.getWorld().getName()
	};
}

Player.prototype.getLocation = function () {

	var location = this.getLocation();

	return {
		'x'     : Number( location.getX() ),
		'y'     : Number( location.getY() ),
		'z'     : Number( location.getZ() ),
		'yaw'   : Number( location.getYaw() ),
		'pitch' : Number( location.getPitch() ),
		'world' : location.getWorld().getName()
	};
}


module.exports = Player;
