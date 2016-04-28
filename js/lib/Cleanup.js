'use strict';

var Cleanup = function () {

	this.tasks = [];
};

Cleanup.prototype.trigger = function () {

	var tasks = this.tasks;

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

	this.tasks =[];
};

Cleanup.prototype.add = function ( task ) {

	if ( typeof task === 'function' ) {
		this.tasks.push( task );

	} else {
		throw new error( 'Invalid cleanup task' );
	}
};

module.exports = new Cleanup();
