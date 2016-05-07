'use strict';

module.exports = function ( username ) {

	var Player = require( '../Class/Player.js' );

	var uuid;
	var player;

	try {
		uuid = java.util.UUID.fromString( username );

	} catch ( error ) {}

	if ( uuid ) {
		player = org.bukkit.Bukkit.getPlayer( uuid )
			|| org.bukkit.Bukkit.getOfflinePlayer( uuid )
	}

	if ( !player ) {
		player = org.bukkit.Bukkit.getPlayer( username )
			|| org.bukkit.Bukkit.getOfflinePlayer( username );
	}

	return new Player( player.getPlayer() );
};
