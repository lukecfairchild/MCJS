'use strict';

module.exports = function ( object ) {

	var actualClass = function () {

		object.call( this, arguments );

		for ( var i in this.private ) {
			this.private[ i ] = this.private[ i ].bind( this );
		}
	};

	Object.defineProperty( actualClass.prototype, 'private', {
		'enumerable' : false,
		'value'      : {}
	} );

	return actualClass;
};
