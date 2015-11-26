'use strict';

var Require = load( PATH + '/global/require.js' );
var require = Require( PATH , [ 'libpath1', 'libpath2' ] );

require( './global/Timers.js' );
require( './global/Object.js' );

require( './main.js' );
