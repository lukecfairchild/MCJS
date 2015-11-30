'use strict';

// Load modules from the mc folder
var files = new java.io.File( './mc' ).listFiles();

for ( var fileIndex in files ) {
//	require( files[ fileIndex ] );
	print( fileIndex );
}
