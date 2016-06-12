'use strict';

/**
 * This file handles initiating all the global objects
 * functions and variables needed for the environment
 */

var Require = load( PATH + '/lib/Require.js' );

/**
 * @function
 * @param {string} path - Specify a target javascript file to load.
 */
var require = Require( PATH, [ 'libpath1', 'libpath2' ] );

global.Class = require( './lib/Class.js' );


/*
 * Load all globals
 * These are loaded from the global folder based off their module.exports keys
 * IE module.export.test = 'yay'
 * would globally set the variable test as 'yay'
 */

var files = new java.io.File( PATH + '/lib/globals' ).listFiles();

for ( var fileIndex in files ) {
	var properties = require( files[ fileIndex ] );

	if ( typeof properties === 'object' ) {

		for ( var property in properties ) {

			if ( typeof properties[ property ] === 'function' ) {
				global[ property ] = properties[ property ].bind( properties );

			} else {
				global[ property ] = properties[ property ];
			}
		}
	}
}


/*
 * Load the MC object into global scope.
 */

global.MC.command( '/chr', function () {

	global.MCJS.reload();
} );


/*
 * Environment is now complete and the main code can now run.
 */

require( './main.js' );
