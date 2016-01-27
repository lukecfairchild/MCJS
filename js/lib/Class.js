'use strict';

module.exports = function ( InternalObject ) {

	var ExternalObject = function () {

		var initiatedObject = new InternalObject( arguments );

		// Add internal
		Object.defineProperty( InternalObject.prototype, 'private', {
			'enumerable' : false,
			'value'      : {}
		} );

		// Add public methods to InternalObject
		for ( var property in this ) {
			InternalObject.prototype[ property ] = ExternalObject.prototype[ property ].bind( initiatedObject );
		}

		// Add private methods to InternalObject
		for ( var property in this.private ) {
			InternalObject.prototype.private[ property ] = ExternalObject.prototype.private[ property ].bind( initiatedObject );
		}

		// Remap ExternalObject to initiatedObject
		for ( var property in this ) {
			this[ property ] = initiatedObject[ property ].bind( initiatedObject );
		}

		// Delete ExternalObject .private attribute
		Object.defineProperty( this, 'private', {
			'enumerable' : false,
			'value'      : undefined
		} );
	};

	Object.defineProperty( ExternalObject.prototype, 'private', {
		'enumerable' : false,
		'value'      : {}
	} );

	return ExternalObject;
};
