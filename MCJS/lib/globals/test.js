'use strict';

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



var A = new Class();

A.prototype.test = function () {

	console.log( 'A' );
};

A.prototype.read = function ( object ) {

	if ( Object.keys( arguments ).length === 0 ) {
		console.log( this );

	} else {
		var objects = String( object ).split( '.' );

		var target = this[ objects[ 0 ] ];

		objects.shift();

		for ( var i = 0; i < objects.length; i++ ) {
			target = target[ objects[ i ] ];
		}

		console.log( target );
	}
};


var B = new Class( function ( bukkitObject ) {

	this.bukkit = bukkitObject;
} );

B.extends( A );

B.prototype.test = function () {

	console.log( 'B' );
};

var c = new B( { 'test' : ['hi','bye'] } )

c.read( 'bukkit' )
c.read()

c.test();