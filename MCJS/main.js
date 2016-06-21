'use strict';

MC.command( '/js', function () {

	console.log( 'Reloading MCJS' );

	MCJS.reload();
} );

MC.command( '/run $', function ( event ) {

	eval( event.arguments.$ );
} );
