'use strict';


/**
 * Class is a simple way to generate a javascript class with privatized variables.
 * @global
 */


var Class = function ( rawInternalObject ) {

	var InternalObject = rawInternalObject || function () {};

	var parents  = {};
	var instance = {};

	Object.defineProperty( InternalObject, 'getParents', {
		'enumerable' : false,
		'value'      : function () {

			return parents;
		}
	} );

	var ExternalObject = function () {

		for ( var i in this.private ) {

			if ( typeof this.private[ i ] === 'function' ) {
				this.private[ i ] = this.private[ i ].bind( this );
			}
		}

		instance = this;

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

	Object.defineProperty( ExternalObject.prototype, 'private', {
		'enumerable' : false,
		'value'      : {}
	} );

	Object.defineProperty( ExternalObject.prototype, 'getClass', {
		'enumerable' : false,
		'value'      : function () {

			return InternalObject;
		}
	} );

	// Add index for extending other classes
	ExternalObject.extends = function ( ExtendingClass ) {

		if ( ExtendingClass.prototype
		&&   typeof ExtendingClass.prototype.getClass === 'function'
		&&   ExtendingClass.prototype.getClass().name !== '' ) {

			var classObject = function () {

				var args = [];

				for ( var i in arguments ) {
					args.push( arguments[ i ] );
				}

				return ExtendingClass.call( instance, args );
			};

			// This allows this.getClass().getParents().someClass.someFunction
			for ( var i in ExtendingClass.prototype ) {
				var target = ExtendingClass.prototype[ i ];

				if ( typeof target === 'function' ) {
					classObject[ i ] = target.bind( ExternalObject.prototype );

				} else {
					classObject[ i ] = target;
				}
			}

			parents[ ExtendingClass.prototype.getClass().name ] = classObject;
		}

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
