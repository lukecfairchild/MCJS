'use strict';

module.exports = function ( world ) {

	var players = [];

	var players = org.bukkit.Bukkit.getOnlinePlayers();

	try {
		var iterator    = rawPlayers.iterator();
		var playerCount = rawPlayers.size();

		if ( world ) {

			for ( var i = 0; i < playerCount; i++ ) {
				var instance = iterator.next();

				if ( instance.getWorld().getName() === world ) {
					players.push( instance );	
				}
			}

		} else {
			for ( var i = 0; i < playerCount; i++ ) {
				players.push( iterator.next() );	
			}
		}

	} catch ( error ) {
		// Do Nothing
	}

	return players;
};
