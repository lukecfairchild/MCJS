'use strict';

global.__plugin  = org.bukkit.Bukkit.getPluginManager().getPlugin( 'CommandHelper' );

// Initiate require()
var Require = load( PATH + '/lib/Require.js' );
var require = Require( PATH, [ 'libpath1', 'libpath2' ] );

global.Class = require( '/lib/Class.js' );

// Load globals
var files = new java.io.File( PATH + '/global' ).listFiles();

for ( var fileIndex in files ) {
	var properties = require( files[ fileIndex ] );

	for ( var property in properties ) {
		global[ property ] = properties[ property ];
	}
}

// Run main.js file
require( './main.js' );
