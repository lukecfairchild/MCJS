'use strict';

/* ====================================== *\
         Class Constructor Function
\* ====================================== */

module.exports = function ( InternalObject ) {

	var initiators = [];

	var ExternalObject = function () {

		// Add internal .private attribute
		Object.defineProperty( InternalObject.prototype, 'private', {
			'enumerable' : false,
			'value'      : {}
		} );

		for ( var initiator in initiators ) {
			
			var tempObject = new initiators[ initiator ]( arguments );

			for ( var property in tempObject ) {
				InternalObject.prototype[ property ] = tempObject[ property ];
			}
		}

		// Add public properties to InternalObject
		for ( var property in this ) {
			InternalObject.prototype[ property ] = ExternalObject.prototype[ property ];
		}

		// Add private properties to InternalObject
		for ( var property in this.private ) {
			InternalObject.prototype.private[ property ] = ExternalObject.prototype.private[ property ];
		}

		// Initiate the object after adding all properties
		var initiatedObject = new InternalObject( arguments );

		// Remap ExternalObject to initiatedObject
		for ( var property in initiatedObject ) {
			this[ property ] = initiatedObject[ property ];
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

		initiators.push( extendingClass );

		for ( var property in extendingClass.prototype ) {
			ExternalObject.prototype[ property ] = extendingClass.prototype[ property ];
		}

		for ( var property in extendingClass.prototype.private ) {
			ExternalObject.prototype.private[ property ] = extendingClass.prototype.private[ property ];
		}
	};

	return ExternalObject;
};
