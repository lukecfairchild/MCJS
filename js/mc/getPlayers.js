'use strict';

module.exports = function ( world ) {

	var players = [];

	var rawPlayers  = org.bukkit.Bukkit.getOnlinePlayers();
	var iterator    = rawPlayers.iterator();
	var playerCount = rawPlayers.size();

	if ( world ) {

		for ( var i = 0; i < playerCount; i++ ) {
			var instance = iterator.next();

			if ( instance.getWorld().getName() === world ) {
				players.push( instance.getName() );	
			}
		}

	} else {
		for ( var i = 0; i < playerCount; i++ ) {
			players.push( iterator.next().getName() );	
		}
	}

	return players;
};
