'use strict';

var CH   = require( './js/CH.js' );
var bind = require( './js/Events.js' );


print( JSON.stringify( CH.ploc( 'kookster' ) ) );

bind( 'player.PlayerChatEvent', function ( event ) {

	print( 'EVENT!!!' );
	print( JSON.stringify( event ) );
} );

setTimeout( function () {

	print( 'YAY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' );
}, 1000 );

setTimeout( function () {

	print( 'YAY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' );
}, 1000 );

//clearAllTasks();