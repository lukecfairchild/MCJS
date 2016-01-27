'use strict';

var Class = require( './Class.js' );

var Car = new Class( function () {

	this.name = 'InternalObject';
} );


Car.prototype.private.test = function () {

	console.log( 'yay' );
}


Car.prototype.test = function () {

	console.log( this );
	this.private.test();
};


var x = new Car();


x.test()
