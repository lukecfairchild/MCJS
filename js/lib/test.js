'use strict';

var Class = require( './Class.js' );


var First = new Class( function () {} );

First.prototype.private.test = function () {

	this.count++;
	console.log( this );
	console.log( this.count );
};

First.prototype.test = function () {

	console.log( 'test' );
	this.private.test();
};


var Second = new Class( function () {

	this.count = 0;
	console.log( 'init' );
	console.log( this );
	this.private.test();
} );

Second.extends( First );

var x = new Second();

x.test();
