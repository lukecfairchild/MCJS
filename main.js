'use strict';

//var CH   = require( './js/CH.js' );
//var bind = require( './js/Events.js' );
var mc = require( './MC.js' );


//print( JSON.stringify( CH.ploc( 'kookster' ) ) );

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
