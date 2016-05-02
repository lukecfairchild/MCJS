'use strict';

var mc = require( './MC.js' );

mc.on( 'player.PlayerChatEvent', function ( event ) {

	print( Object.keys( event ) );
	print( event.getPlayer().getName() );
	print( event.getMessage() );
	print( event.getRecipients() );
	print( event.getEventName() );
} );


var delay = java.lang.System.currentTimeMillis();

mc.on( 'player.PlayerMoveEvent', function ( event ) {

	var now = java.lang.System.currentTimeMillis();

	if ( now > delay + 1000 ) {

		delay = now;
		console.log( event.getPlayer().getLocation() );
	}
} );

mc.on( 'player.PlayerJoinEvent', function ( event ) {

	mc.broadcast( 'Welcome ' + event.getPlayer() );
} );

mc.command( '/test [$]', function ( event ) {

	event.getPlayer().sendMessage( event.arguments.$ );
} );

mc.command( '/run [$]', function ( event ) {

	eval( event.arguments.$ );
} );
