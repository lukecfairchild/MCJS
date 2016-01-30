'use strict';

/* ====================================== *\
         Class Constructor Function
\* ====================================== */

var Class = function ( InternalObject ) {

	var ExternalObject = InternalObject;
/*
	var ExternalObject = function () {

		// Add internal .private attribute
		if ( InternalObject.prototype.private === undefined ) {
			Object.defineProperty( InternalObject.prototype, 'private', {
				'enumerable' : false,
				'value'      : {}
			} );
		}

		// Add public properties to InternalObject
		for ( var property in ExternalObject.prototype ) {

			if ( typeof ExternalObject.prototype[ property ] === 'function' ) {
				InternalObject.prototype[ property ] = ExternalObject.prototype[ property ].bind( InternalObject.prototype );

			} else {
				InternalObject.prototype[ property ] = ExternalObject.prototype[ property ];
			}
		}

		// Add private properties to InternalObject
		for ( var property in ExternalObject.prototype.private ) {

			if ( typeof ExternalObject.prototype.private[ property ] === 'function' ) {
				InternalObject.prototype.private[ property ] = ExternalObject.prototype.private[ property ].bind( InternalObject.prototype );

			} else {
				InternalObject.prototype.private[ property ] = ExternalObject.prototype.private[ property ];
			}
		}

		// Initiate the object after adding all properties
		var initiatedObject = new InternalObject( arguments );

		// Remap ExternalObject to initiatedObject
		for ( var property in initiatedObject ) {

			if ( typeof initiatedObject[ property ] === 'function' ) {
				this[ property ] = initiatedObject[ property ].bind( initiatedObject );

			} else {
				this[ property ] = initiatedObject[ property ];
			}
		}

		for ( var property in initiatedObject ) {

			if ( typeof initiatedObject[ property ] === 'function' ) {
				initiatedObject[ property ] = initiatedObject[ property ].bind( initiatedObject );

			} else {
				initiatedObject[ property ] = initiatedObject[ property ];
			}
		}

		for ( var property in initiatedObject.private ) {

			if ( typeof initiatedObject.private[ property ] === 'function' ) {
				initiatedObject.private[ property ] = initiatedObject.private[ property ].bind( initiatedObject );

			} else {
				initiatedObject.private[ property ] = initiatedObject.private[ property ];
			}
		}

		// Delete ExternalObject .private attribute
		Object.defineProperty( this, 'private', {
			'enumerable' : false,
			'value'      : undefined
		} );
	};
*/
	// Add ExternalObject .private attribute
	Object.defineProperty( ExternalObject.prototype, 'private', {
		'enumerable' : false,
		'value'      : {}
	} );

	// Add index for extending other classes
	ExternalObject.extends = function ( ExtendingClass ) {

		for ( var property in ExtendingClass.prototype ) {

			if ( typeof ExtendingClass.prototype[ property ] === 'function' ) {
				ExternalObject.prototype[ property ] = ExtendingClass.prototype[ property ].bind( ExternalObject.prototype );

			} else {
				ExternalObject.prototype[ property ] = ExtendingClass.prototype[ property ];
			}
		}

		for ( var property in ExtendingClass.prototype.private ) {

			if ( typeof ExtendingClass.prototype.private[ property ] === 'function' ) {
				ExternalObject.prototype.private[ property ] = ExtendingClass.prototype.private[ property ].bind( ExternalObject.prototype );

			} else {
				ExternalObject.prototype.private[ property ] = ExtendingClass.prototype.private[ property ];
			}
		}
	};

	return ExternalObject;
};

module.exports = Class;
