'use strict';

module.exports = function ( world ) {

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
