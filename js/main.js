'use strict';

// var ch = require( './CH.js' );
var mc = require( './MC.js' );


//print( JSON.stringify( ch.ploc( 'kookster' ) ) );

mc.on( 'player.PlayerChatEvent', function ( event ) {

	console.log( Object.keys( event ) );
	console.log( event.getPlayer() );
	console.log( event.getMessage() );
	console.log( event.getRecipients() );

	console.log( event.getEventName() );
	event.setMessage( 'yay' );
	event.setPlayer( 'kookster' );
} );

mc.on( 'player.PlayerMoveEvent', function ( event ) {

	console.log( event );
} );
