'use strict';

MC.broadcast( 'Hello World' );

MC.command( '/reload', function () {

	console.log( 'Reloading MCJS' );

	MCJS.reload();
} );

MC.command( '/hi', function () {

	MC.broadcast( 'hi!' );
} );

File.write( './test.txt', 'hi' );
File.append( './test.txt', ' again' );
console.log( File.read( './test.txt' ) );

setTimeout( function () {

	File.delete( './test.txt' );
	console.log( File.read( './test.txt' ) );
}, 2000 );
