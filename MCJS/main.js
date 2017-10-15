'use strict';

MC.command( '/js', function ( event ) {

	var message = 'Reloading MCJS';

	event.getPlayer().sendMessage( message );

	MCJS.reload();
} );

MC.command( '/run $', function ( event ) {

	eval( event.arguments.$ );
} );

MC.command( '/l', function ( event ) {

	var rawPlayers = MC.getPlayers();

	var players = [];

	for ( var i in rawPlayers ) {
		players.push( rawPlayers[ i ].getDisplayName() );
	}

	event.getPlayer().sendMessage( 'There is ' + players.length + ' player' + ( players.length === 1 ? '' : 's' ) + ' online.\n' + players.join( ', ' ) );
} );


/* New thread test
MC.newThread( function () {

	MC.mainThread( function () {

		setTimeout( function () {

			MC.broadcast( 'yay' );
		}, 1000 );
	} );
} );
*/
