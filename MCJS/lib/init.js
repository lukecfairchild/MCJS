'use strict';

var Require = load( PATH + '/lib/globals/Require.js' );


/**
 * Function for loading other javascript files.
 * @function
 * @param {string} filePath - Specify a target javascript file to load.
 * @return {Object} exports - If the target javascript file set module.exports to anything this will be the result of it.
 */

var require = Require( PATH, [ 'libpath1', 'libpath2' ] );

//load( PATH + '/lib/test.js');

/*
 * Load all globals
 */

global.Class = require( './lib/globals/Class.js' );
global.MCJS  = require( './lib/globals/MCJS.js' );

require( './lib/globals/Colors.js' );

var Timers = require( './lib/globals/Timers.js' );

global.setInterval   = Timers.setInterval;
global.setTimeout    = Timers.setTimeout;
global.clearAllTasks = Timers.clearAllTasks;
global.clearInterval = Timers.clearInterval;
global.clearTimeout  = Timers.clearTimeout;
global.console       = require( './lib/globals/console.js' );

global.File      = require( './lib/globals/File.js' );
global.Directory = require( './lib/globals/Directory.js' );
global.MySQL     = require( './lib/globals/MySQL.js' );

global.MC = require( './lib/globals/MC.js' );


/*
 * Environment is now complete run the main code.
 */

require( './main.js' );
