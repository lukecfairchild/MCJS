'use strict';

var Class = require( './Class.js' );

var Car = new Class( function () {

	this.name = 'InternalObject';
} );


Car.prototype.private.test = function () {

	console.log( 'Car.private.test(): ' + this.name );
}


Car.prototype.test = function () {

	console.log( 'Car.test(): ' + this.name );
	this.private.test()
};


var x = new Car();


x.test()



