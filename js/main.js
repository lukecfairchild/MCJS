'use strict';

var mc = require( './MC.js' );

mc.on( 'player.PlayerChatEvent', function ( event ) {

	print( Object.keys( event ) );
	print( event.getPlayer().getName() );
	print( event.getMessage() );
	print( event.getRecipients() );
	print( event.getEventName() );
} );

/*
var delay = java.lang.System.currentTimeMillis();

mc.on( 'player.PlayerMoveEvent', function ( event ) {

	var now = java.lang.System.currentTimeMillis();

	if ( now > delay + 1000 ) {

		delay = now;
		console.log( event.getPlayer().getLocation() );
	}
} );
*/

mc.on( 'player.PlayerJoinEvent', function ( event ) {

	mc.broadcast( 'Welcome ' + event.getPlayer().getName() );
} );

mc.command( '/run [$]', function ( event ) {

	eval( event.arguments.$ );
} );

mc.command( '/test', function ( event ) {

	var player = event.getPlayer();

	var loc = player.getLocation();

	loc.y += 1;

	var newLoc = {
		'x' : loc.x,
		'y' : loc.y
	};

	player.setLocation( newLoc );
} );

mc.command( '/fly $state', function ( event ) {

	var state;

	var player = event.getPlayer();

	switch ( event.arguments.state ) {
		case 'true' : {
			state = true;

			break;
		}

		case 'false' : {
			state = false;

			break;
		}

		default : {
			player.sendMessage( 'Invalid choice, choose: "true" or "false"' );

			return;
		}
	}
	
	player.sendMessage( 'Flight set to ' + state );
	player.setAllowFlight( state );
} );
