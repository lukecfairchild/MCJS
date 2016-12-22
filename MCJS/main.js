'use strict';

MC.command( '/js', function ( event ) {

	var message = 'Reloading MCJS';

	event.getPlayer().sendMessage( message );

	MCJS.reload();
} );

MC.command( '/run $', function ( event ) {

	eval( event.arguments.$ );
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
