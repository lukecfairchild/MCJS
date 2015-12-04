'use strict';

var ch = require( './CH.js' );
var mc = require( './MC.js' );


//print( JSON.stringify( ch.ploc( 'kookster' ) ) );

mc.on( 'player.PlayerChatEvent', function ( event ) {

	print( Object.keys( event ) );
	print( event.getPlayer() );
	print( event.getMessage() );
	print( JSON.stringify( event.getRecipients() ) );

	print( event.getEventName() );
	event.setMessage( 'yay' );
	event.setPlayer( 'kookster' );
} );

setInterval( function () {

	print( 'yep' );
}, 1000 );



setTimeout( function () {

	print( 'YAY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' );
}, 2000 );

clearAllTasks();
