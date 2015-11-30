'use strict';

var ch = require( './js/CH.js' );
var mc = require( './MC.js' );


//print( JSON.stringify( ch.ploc( 'kookster' ) ) );

mc.on( 'player.PlayerChatEvent', function ( event ) {

	print( 'EVENT2!!!' );
	print( JSON.stringify( event ) );
} );

setInterval( function () {

	print( 'yep' );
}, 1000 );



setTimeout( function () {

	print( 'YAY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' );
}, 2000 );

clearAllTasks();
