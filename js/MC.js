'use strict';

// Load modules from the mc folder
var files = new java.io.File( PATH + '/mc' ).listFiles();

for ( var index in files ) {
	var file  = String( files[ index ] );
	var match = file.match( /([^\.\\]+)\.js/ );

	if ( match && match[ 1 ] ) {
		module.exports[ match[ 1 ] ] = require( file );
	}
}
