'use strict';

module.exports = function ( object ) {

	object = object || function () {};

	Object.defineProperty( object.prototype, 'private', {
		'enumerable' : false,
		'value'      : {}
	} );

	return object;
};
