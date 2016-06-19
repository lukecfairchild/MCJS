'use strict';


/**
 * @class
 * @augments {HumanEntity}
 * @augments {LivingEntity}
 * @augments {OfflinePlayer}
 * @example
 * var player = MC.getPlayer( 'kookster' );
 *
 * MC.command( '/command', function ( event ) {
 *
 * 	var player = event.getPlayer();	
 * } );
 *
 * MC.event( 'player.PlayerChatEvent', function ( event ) {
 *
 * 	var player = event.getPlayer();	
 * } );
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
 * Gets the Location where this player will respawn.
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
 * Get this players previously set compass target.
 * @implements Player
 * @return {Location}
 */

Player.prototype.getCompassTarget = function () {

	var Location = require( './Location.js' );

	return new Location( this.getCompassTarget() );
};


/**
 * Gets this current players location.
 * @implements Player
 * @return {Location}
 */

Player.prototype.getLocation = function () {

	var Location = require( './Location.js' );

	return new Location( this.getLocation() );
};


/**
 * Changes this players current location to the target location.
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
 * Gets if this player is online or not.
 * @implements Player
 * @return {boolean}
 */

Player.prototype.isOnline = function () {

	return this.isOnline();
};


/**
 * Says a message as this player.
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
 * Runs a command as this player.
 * @implements Player
 * @param {String} command 
 * @example
 * player.run( '/command' ); 
 */

Player.prototype.run = function ( command ) {

	this.performCommand( command.replace( /^\//, '' ) );
};


/**
 * Gets this players IP address.
 * @implements Player
 * @return {String} ip
 * @example
 * var ip = player.getIp; 
 */

Player.prototype.getIp = function () {

	return this.getAddress().getHostName();
};


/**
 * Gets if this player is allowed to fly or not currently.
 * @implements Player
 * @return {Boolean} canFly
 * @example
 * var canFly = player.canFly(); 
 */

Player.prototype.canFly = function () {

	return this.getAllowFlight();
};


/**
 * Gets the display name of this player.
 * @implements Player
 * @return {String} displayName
 * @example
 * var displayName = player.getDisplayName(); 
 */

Player.prototype.getDisplayName = function () {

	return this.getDisplayName();
};


/**
 * Returns true if the player's time is relative to the server time, otherwise the player's time is absolute and will not change its current time unless done so with setTime().
 * @implements Player
 * @return {Boolean}
 * @example
 * var timeRelative = player.isTimeRelative(); 
 */

Player.prototype.isTimeRelative = function () {

	return this.isPlayerTimeRelative();
};


/**
 * Restores the normal condition where the player's time is synchronized with the server time.
 * @implements Player
 * @example
 * player.resetTime(); 
 */

Player.prototype.resetTime = function () {

	this.resetPlayerTime();
};


/**
 * Sets the current time on the player's client. The time will be kept synchronized to its world time with the specified offset.
 * @param {Number} time
 * @implements Player
 * @example
 * player.setTime( 1000 );
 */

Player.prototype.setTime = function ( time ) {

	this.setPlayerTime( time, true );
};


/**
 * When using fixed time the player's time will stay fixed at the specified time parameter. It's up to the caller to continue updating the player's time.
 * @param {Number} time
 * @implements Player
 * @example
 * player.setFixedTime( 1000 );
 */

Player.prototype.setFixedTime = function ( time ) {

	this.setPlayerTime( time, false );
};


/*
https://hub.spigotmc.org/javadocs/spigot/

Returns whether the player is sleeping ignored.
isSleepingIgnored()

isSprinting()
Gets whether the player is sprinting or not.

kickPlayer(String message)
Kicks player with custom kick message.

loadData()
Loads the players current location, health, inventory, motion, and other information from the username.dat file, in the world/player folder.

	saveData()
Saves the players current location, health, inventory, motion, and other information into the username.dat file, in the world/player folder

playEffect(Location loc, Effect effect, T data)
Plays an effect to just this player.

playNote(Location loc, Instrument instrument, Note note)
Play a note for a player at a location.

playSound(Location location, String sound, float volume, float pitch)
Play a sound for a player at the location.

removeAchievement(Achievement achievement)
Removes the given achievement and any children achievements that the player has.

resetPlayerWeather()
Restores the normal condition where the player's weather is controlled by server conditions.

void	sendRawMessage(String message)
Sends this sender a message raw

void	sendMap(MapView map)
Render a map and send it to the player in its entirety.
*/

module.exports = Player;

/*
isOnGround()
*/