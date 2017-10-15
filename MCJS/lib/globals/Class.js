'use strict';


/**
 * Class is a simple way to generate a javascript class with privatized variables.
 * @global
 */

var Class = function ( newClass ) {

	newClass = newClass || function () {};

	var tempClass = function () {

		for ( var i in tempClass.prototype ) {
			newClass.prototype[ i ] = tempClass.prototype[ i ];
		}

		var args = [ null ].concat( [].slice.call( arguments ) );

		var initiatedClass = new ( newClass.bind.apply( newClass, args ) )();

		var returnObject = {};

		for ( var i in initiatedClass ) {

			if ( typeof initiatedClass[ i ] === 'function' ) {
				Object.defineProperty( returnObject, i, {
					'value'      : initiatedClass[ i ].bind( initiatedClass ),
					'enumerable' : true
				} );
			}
		}

		return returnObject;
	};

	tempClass.extends = function ( extendingClass ) {

		for ( var i in extendingClass.prototype ) {

			if ( newClass.prototype[ i ] === undefined ) {
				newClass.prototype[ i ] = extendingClass.prototype[ i ];
			}
		}
	};

	tempClass.private = {};

	return tempClass;
};


module.exports = Class;
