'use strict';

var Cleanup = function () {

	this.tasks = [];
};

Cleanup.prototype.trigger = function () {

	var tasks = this.properties.tasks;

	for ( var index in tasks ) {
		var task = tasks[ index ];

		if ( typeof task === 'function' ) {
			task();
		}
	}
};

Cleanup.prototype.add = function ( task ) {

	if ( typeof task === 'function' ) {
		this.properties.tasks.push( task );

	} else {
		throw new error( 'Invalid cleanup task' );
	}
};

module.exports.Cleanup = new Cleanup();
