'use strict';

// Initiate require()
var Require = load( PATH + '/lib/require.js' );
var require = Require( PATH , [ 'libpath1', 'libpath2' ] );

// Load globals
var files = new java.io.File( PATH + './global' ).listFiles();

for ( var fileIndex in files ) {
	var properties = require( files[ fileIndex ] );

	for ( var property in properties ) {
		global[ property ] = properties[ property ];
	}
}

// Run main.js file
require( './main.js' );
