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


var MySQL = require( './lib/MySQL.js' );

MySQL.connect( 'main', {
	'username' : 'letsbuild',
	'password' : 'e8nNtJp96uTXrD9V',
	'url'      : '192.168.2.100',
	'port'     : 3306,
	'database' : 'letsbuild_commandhelper'
} );

var player1 = MySQL.query( 'main', 'SELECT rank FROM player WHERE username = ?', [
	'kookster'
] )[ 0 ];

console.log( player1 );

/*console.log( player1.rank );

MySQL.query( 'main', 'UPDATE player SET rank = ? WHERE username = ?', [
	'default',
	'kookster'
] );

var player2 = MySQL.query( 'main', 'SELECT rank FROM player WHERE username = ?', [
	'kookster'
] )[ 0 ];
console.log( player2.rank );

MySQL.query( 'main', 'UPDATE player SET rank = ? WHERE username = ?', [
	'owner',
	'kookster'
] );

var player2 = MySQL.query( 'main', 'SELECT rank FROM player WHERE username = ?', [
	'kookster'
] )[ 0 ];
console.log( player2.rank );*/
