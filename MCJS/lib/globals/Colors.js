'use strict';

var colors = {
	'0' : 'black',
	'1' : 'darkBlue',
	'2' : 'green',
	'3' : 'teal',
	'4' : 'darkRed',
	'5' : 'purple',
	'6' : 'orange',
	'7' : 'darkGrey',
	'8' : 'grey',
	'9' : 'blue',
	'a' : 'lightGreen',
	'b' : 'lightBlue',
	'c' : 'red',
	'd' : 'pink',
	'e' : 'yellow',
	'f' : 'white',
	'i' : 'bold',
	'n' : 'underline',
	's' : 'italic',
	'k' : 'random',
	'r' : 'reset'
};

for ( var i in colors ) {
	( function ( index, color ) {

		if ( !String.prototype[ color ] ) {
			Object.defineProperty( String.prototype, color, {
				'enumerable' : false,
				'value'      : function () {

					return '\u00A7' + index + this + '\u00A7r';
				}
			} );
		}
	} ) ( i, colors[ i ] );
}

if ( !String.prototype.colorize ) {
	Object.defineProperty( String.prototype, 'colorize', {
		'enumerable' : false,
		'value'      : function () {

			var returns = this;

			for ( var i in colors ) {
				returns = returns.replace( new RegExp( '\\&' + i, 'g' ), '\u00A7' + i );
			}

			return returns + '\u00A7r';
		}
	} );
}
