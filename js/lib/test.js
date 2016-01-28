'use strict';

var Class = require( './Class.js' );


var First = new Class( function () {

	console.log( this.private.test2() === 'test2' );
	this.private.test1 = function () {

		console.log( this.private.test2() === 'test2' ); // broken

		return 'test1';
	};
} );

First.prototype.private.test2 = function () {

	console.log( this.private.test1() === 'test1' ); // broken

	return 'test2';
};

First.prototype.test = function () {

	console.log( this.private.test1() === 'test1' );
	console.log( this.private.test2() === 'test2' );
};




var x = new First();

x.test();

var Second = new Class( function () {

	console.log( this.private.test1 === undefined );
	console.log( this.private.test2() === 'test2' );
} );

Second.extends( First );

var y = new Second()