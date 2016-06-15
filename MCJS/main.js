'use strict';

MC.broadcast( 'Hello World' );

MC.command( '/reload', function () {

	console.log( 'Reloading MCJS' );

	MCJS.reload();
} );

MC.command( '/hi', function () {

	MC.broadcast( 'hi!' );
} );


require( './New folder/a.js' );
