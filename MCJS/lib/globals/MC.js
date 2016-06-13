'use strict';


/**
 * @namespace
 */

var MC = new Class( function () {

	var files = new java.io.File( PATH + '/lib/globals/mc' ).listFiles();

	for ( var index in files ) {
		var file  = String( files[ index ] );
		var match = file.match( /([^\.\\]+)\.js/ );

		if ( match && match[ 1 ] ) {
			this[ match[ 1 ] ] = require( file );
		}
	}
} );


/**
 * @property MC
 * @param {string} message - Message to send all players
 */

MC.prototype.broadcast = function ( message ) {

	console.log( message );

	var players = this.getPlayers();

	for ( var i in players ) {
		players[ i ].sendMessage( message );
	}
};


/**
 * @property MC
 * @param {string} username/uuid - Player username or uuid.
 * @return {Player}
 */

MC.prototype.getPlayer = function ( username ) {

	var Player = require( '/lib/Class/Player.js' );

	var uuid;
	var player;

	try {
		uuid = java.util.UUID.fromString( username );

	} catch ( error ) {}

	if ( uuid ) {
		player = org.bukkit.Bukkit.getPlayer( uuid )
			|| org.bukkit.Bukkit.getOfflinePlayer( uuid );
	}

	if ( !player ) {
		player = org.bukkit.Bukkit.getPlayer( username );
	}

	if ( !player ) {
		player = org.bukkit.Bukkit.getOfflinePlayer( username );
	}

	return new Player( player.getPlayer() || player );
};


/**
 * @property MC
 * @param {string} [world] - World name.
 * @return [ {Player} ]
 */

MC.prototype.getPlayers = function ( world ) {

	var Player = require( '../Class/Player.js' );

	var players = [];

	var players = org.bukkit.Bukkit.getOnlinePlayers();

	try {
		var iterator    = rawPlayers.iterator();
		var playerCount = rawPlayers.size();

		if ( world ) {

			for ( var i = 0; i < playerCount; i++ ) {
				var instance = iterator.next();

				if ( instance.getWorld().getName() === world ) {
					players.push( new Player( instance ) );	
				}
			}

		} else {
			for ( var i = 0; i < playerCount; i++ ) {
				players.push( new Player( iterator.next() ) );	
			}
		}

	} catch ( error ) {
		// Do Nothing
	}

	return players;
};


module.exports = new MC();
