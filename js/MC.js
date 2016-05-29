'use strict';

/**
 * @namespace
 */
var MC = function () {

	var files = new java.io.File( PATH + '/mc' ).listFiles();

	for ( var index in files ) {
		var file  = String( files[ index ] );
		var match = file.match( /([^\.\\]+)\.js/ );

		if ( match && match[ 1 ] ) {
			this[ match[ 1 ] ] = require( file );
		}
	}
};

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

	var Player = require( '../Class/Player.js' );

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

module.exports = new MC();
