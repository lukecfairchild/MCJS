'use strict';

module.exports = function ( InternalObject ) {

	var ExternalObject = function () {

		// Add internal
		Object.defineProperty( InternalObject.prototype, 'private', {
			'enumerable' : false,
			'value'      : {}
		} );

		// Add private methods to InternalObject
		for ( var i in this.private ) {

			if ( typeof this.private[ i ] === 'function' ) {
				InternalObject.prototype.private[ i ] = this.private[ i ].bind( InternalObject );

			} else {
				InternalObject.prototype.private[ i ] = this.private[ i ];
			}
		}

		// Add public methods to InternalObject
		for ( var property in this ) {

			if ( typeof this[ property ] === 'function' ) {
				InternalObject.prototype[ property ] = this[ property ].bind( InternalObject );

			} else {
				InternalObject.prototype[ property ] = this[ property ];
			}
		}

		// Initiate InternalObject
		var initiatedObject = new InternalObject( arguments );

		for ( var property in this ) {

			this[ property ] = function ( callback ) {

				var args = [];

				for ( var arg in arguments ) {
					args.push( arguments[ arg ] );
				}

	//			if ( args ) {
	//				initiatedObject[ callback ]( args.splice( 1, args.length - 1 ) );

	//			} else {
					initiatedObject[ callback ]();
	//			}
			}.bind( null, property );
		}

		// Delete ExternalObject .private attribute
		Object.defineProperty( this, 'private', {
			'enumerable' : false,
			'value'      : undefined
		} );
	};

	Object.defineProperty( ExternalObject.prototype, 'private', {
		'enumerable' : false,
		'value'      : {}
	} );

	return ExternalObject;
};
