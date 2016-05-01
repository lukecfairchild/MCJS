'use strict';

module.exports = function ( message ) {

	console.log( message );

	var players = this.getPlayers();

	for ( var i in players ) {
		players[ i ].sendMessage( message );
	}
};
