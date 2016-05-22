'use strict';

var Player = new Class( function ( bukkitObject ) {

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

Player.extends( require( './HumanEntity.js' ) );
Player.extends( require( './LivingEntity.js' ) );
Player.extends( require( './OfflinePlayer.js' ) );

Player.prototype.getBedSpawnLocation = function () {

	var Location = require( './Location.js' );

	return new Location( this.getBedSpawnLocation() );
};

Player.prototype.getLocation = function () {

	var Location = require( './Location.js' );

	return new Location( this.getLocation() );
};

Player.prototype.setLocation = function ( location ) {

	var errors = [];

	if ( location.x === undefined ) {
		errors.push( 'x is undefined' );
	}

	if ( location.y === undefined ) {
		errors.push( 'y is undefined' );
	}

	if ( location.z === undefined ) {
		errors.push( 'z is undefined' );
	}

	if ( errors.length ) {
		throw new Error( 'Error in (Player.js).setLocation( ' + JSON.stringify( location ) +' ): ' + errors );
	}


	var playerLocation = this.getLocation();

	var world;

	if ( location.world ) {
		world = org.bukkit.Bukkit.getWorld( location.world );

	} else {
		world = playerLocation.getWorld();
	}

	var bukkitLocation = new org.bukkit.Location(
		world,
		location.x     || playerLocation.getX(),
		location.y     || playerLocation.getY(),
		location.z     || playerLocation.getZ(),
		location.yaw   || playerLocation.getYaw(),
		location.pitch || playerLocation.getPitch()
	);

	this.teleport( bukkitLocation );
};

Player.prototype.isOnline = function () {

	return this.isOnline();
};

module.exports = Player;
