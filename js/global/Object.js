'use strict';

if ( !Object.prototype.splice ) {
	Object.defineProperty( Object, 'splice', {
		'value' : function () {

			return [].splice.call( this, arguments[ 0 ], arguments[ 1 ] );
		},
		'enumerable' : false
	} );
}

if ( !Object.prototype.slice ) {
	Object.defineProperty( Object, 'slice', {
		'value' : function () {

			return [].slice.call( this, arguments[ 0 ], arguments[ 1 ] );
		},
		'enumerable' : false
	} );
}
