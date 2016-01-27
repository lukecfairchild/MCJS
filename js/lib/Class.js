'use strict';

/* ====================================== *\
         Class Constructor Function
\* ====================================== */

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

			if ( typeof ExternalObject.prototype[ property ] === 'function' ) {
				InternalObject.prototype[ property ] = ExternalObject.prototype[ property ].bind( initiatedObject );

			} else {
				InternalObject.prototype[ property ] = ExternalObject.prototype[ property ];
			}
		}

		// Add private methods to InternalObject
		for ( var property in this.private ) {

			if ( typeof ExternalObject.prototype.private[ property ] === 'function' ) {
				InternalObject.prototype.private[ property ] = ExternalObject.prototype.private[ property ].bind( initiatedObject );

			} else {
				InternalObject.prototype.private[ property ] = ExternalObject.prototype.private[ property ];
			}
		}

		// Remap ExternalObject to initiatedObject
		for ( var property in this ) {

			if ( typeof initiatedObject[ property ] === 'function' ) {
				this[ property ] = initiatedObject[ property ].bind( initiatedObject );

			} else {
				this[ property ] = initiatedObject[ property ];
			}
		}

		// Delete ExternalObject .private attribute
		Object.defineProperty( this, 'private', {
			'enumerable' : false,
			'value'      : undefined
		} );
	};

	// Add ExternalObject .private attribute
	Object.defineProperty( ExternalObject.prototype, 'private', {
		'enumerable' : false,
		'value'      : {}
	} );

	// Add index for extending other classes
	ExternalObject.extends = function ( extendingClass ) {

		for ( var property in extendingClass.prototype ) {
			ExternalObject.prototype[ property ] = extendingClass.prototype[ property ];
		}

		for ( var property in extendingClass.prototype.private ) {
			ExternalObject.prototype.private[ property ] = extendingClass.prototype.private[ property ];
		}
	};

	return ExternalObject;
};
