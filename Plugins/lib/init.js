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


/*
 * Load all globals
 */

global.Class = require( './lib/Class.js' );

require( './lib/globals/Object.js' );
require( './lib/globals/String.js' );

var Timers = require( './lib/globals/Timers.js' );

global.setInterval   = Timers.setInterval;
global.setTimeout    = Timers.setTimeout;
global.clearAllTasks = Timers.clearAllTasks;

global.console = require( './lib/globals/console.js' );
global.MCJS    = require( './lib/globals/MCJS.js' );
global.MC      = require( './lib/globals/MC.js' );


/*
 * Environment is now complete and the main code can now run.
 */

require( './main.js' );
