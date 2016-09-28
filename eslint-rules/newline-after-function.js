'use strict';

module.exports = function ( context ) {

	return {
		'FunctionExpression' : function ( node ) {

			var source = context.getSourceCode( node );
			var text   = source.getText( node ).replace( /\r/g, '' ).split( '\n' );

			if ( text.length > 1
			&&   text[ 1 ] !== '' ) {
				context.report( node, 'newline is required after a FunctionExpression' );
			}
		}
	};
};
