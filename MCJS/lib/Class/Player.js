'use strict';


/**
 * @class
 * @augments {HumanEntity}
 * @augments {LivingEntity}
 * @augments {OfflinePlayer}
 */

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


/**
 * Gets the Location where the player will respawn.
 * @implements Player
 * @return {Location}
 */

Player.prototype.getSpawnLocation = function () {

	var location;

	var Location = require( './Location.js' );

	var location = this.getBedSpawnLocation();

	if ( location ) {
		location = new Location( location );

	} else {
		location = new Location( this.getWorld().getSpawnLocation() );
	}

	return location;
};


/**
 * Get the previously set compass target.
 * @implements Player
 * @return {Location}
 */

Player.prototype.getCompassTarget = function () {

	var Location = require( './Location.js' );

	return new Location( this.getCompassTarget() );
};


/**
 * @implements Player
 * @return {Location}
 */

Player.prototype.getLocation = function () {

	var Location = require( './Location.js' );

	return new Location( this.getLocation() );
};


/**
 * @implements Player
 * @param {Location} location
 */

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


/**
 * @implements Player
 * @return {boolean}
 */

Player.prototype.isOnline = function () {

	return this.isOnline();
};


/**
 * @implements Player
 * @param {String} message
 * @example
 * player.chat( 'hi!' ); 
 */

Player.prototype.chat = function ( message ) {

	if ( message.match( /^\// ) ) {
		message = ''.reset() + message;
	}

	this.chat( message );
};


/**
 * @implements Player
 * @param {String} command 
 * @example
 * player.run( '/command' ); 
 */

Player.prototype.run = function ( command ) {

	if ( !command.match( /^\// ) ) {
		command = '/' + command;
	}

	this.chat( command );
};


/**
 * @implements Player
 * @return {String} ip
 * @example
 * player.getIp; 
 */

Player.prototype.getIp = function () {

	return this.getAddress().getHostName();
};


/**
 * @implements Player
 * @return {Boolean} canFly
 * @example
 * player.canFly(); 
 */

Player.prototype.canFly = function () {

	return this.getAllowFlight();
};


/**
 * Gets the "friendly" name to display of this player.
 * @implements Player
 * @return {String} displayName
 * @example
 * player.getDisplayName(); 
 */

Player.prototype.getDisplayName = function () {

	return this.getDisplayName();
};


module.exports = Player;
