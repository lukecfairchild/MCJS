'use strict';

/**
 * @class
 */
var Class = function ( rawInternalObject ) {

	var InternalObject = rawInternalObject || function () {};

	var ExternalObject = function () {

		var returnObject = {};

		Object.defineProperty( returnObject, 'getClass', {
			'enumerable' : false,
			'value'      : function () {

				return InternalObject;
			}
		} );

		var args = [];

		for ( var i in arguments ) {
			args.push( arguments[ i ] );
		}

		InternalObject.apply( this, args );

		for ( var i in this ) {

			if ( typeof this[ i ] === 'function' ) {
				returnObject[ i ] = this[ i ].bind( this );

			} else {
				returnObject[ i ] = this[ i ];
			}
		}

		return returnObject;
	};

	Object.defineProperty( ExternalObject.prototype, 'getClass', {
		'enumerable' : false,
		'value'      : function () {

			return InternalObject;
		}
	} );

	Object.defineProperty( ExternalObject.prototype, 'private', {
		'enumerable' : false,
		'value'      : {}
	} );

	// Add index for extending other classes
	ExternalObject.extends = function ( ExtendingClass ) {

		for ( var property in ExtendingClass.prototype ) {
			var target = ExtendingClass.prototype[ property ];

			if ( ExternalObject.prototype[ property ] === undefined ) {

				if ( typeof target === 'function' ) {
					ExternalObject.prototype[ property ] = target.bind( ExternalObject.prototype );

				} else {
					ExternalObject.prototype[ property ] = target;
				}
			}
		}

		for ( var property in ExtendingClass.prototype.private ) {
			var target = ExtendingClass.prototype.private[ property ];

			if ( ExternalObject.prototype[ property ] === undefined ) {

				if ( typeof target === 'function' ) {
					ExternalObject.prototype.private[ property ] = target.bind( ExternalObject.prototype );

				} else {
					ExternalObject.prototype.private[ property ] = target;
				}
			}
		}
	};

	return ExternalObject;
};

module.exports = Class;
