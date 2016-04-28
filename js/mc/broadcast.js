'use strict';

module.exports = function ( message ) {

	console.log( message );

	var rawPlayers  = org.bukkit.Bukkit.getOnlinePlayers();
	var players     = rawPlayers.iterator();
	var playerCount = rawPlayers.size();

	for ( var i = 0; i < playerCount; i++ ) {
		players.next().sendMessage( message );
	}
};
