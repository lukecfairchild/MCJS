'use strict';

var Cleanup = function () {};

Cleanup.prototype.trigger = function () {

	var tasks = __instance.cleanup;

	for ( var index in tasks ) {
		var task = tasks[ index ];

		if ( typeof task === 'function' ) {

			try {
				task();

			} catch ( error ) {
				// Do Nothing
			}
		}
	}

	__instance.cleanup = [];
};

Cleanup.prototype.add = function ( task ) {

	if ( typeof task === 'function' ) {
		__instance.cleanup.push( task );

	} else {
		throw new error( 'Invalid cleanup task' );
	}
};

module.exports = new Cleanup();
