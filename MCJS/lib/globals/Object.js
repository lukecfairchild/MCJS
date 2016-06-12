'use strict';

if ( !Object.prototype.splice ) {
	Object.defineProperty( Object.prototype, 'splice', {
		'value' : function () {

			return [].splice.call( this, arguments[ 0 ], arguments[ 1 ] );
		},
		'enumerable' : false
	} );
}

if ( !Object.prototype.slice ) {
	Object.defineProperty( Object.prototype, 'slice', {
		'value' : function () {

			return [].slice.call( this, arguments[ 0 ], arguments[ 1 ] );
		},
		'enumerable' : false
	} );
}
