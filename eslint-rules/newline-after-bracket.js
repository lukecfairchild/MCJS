'use strict';

module.exports = function ( context ) {

	return {
		'ArrayExpression' : function ( node ) {

			var rawSource = context.getSourceCode();

			var lines = rawSource.getText().replace( /\r/g, '' ).split( '\n' );
			var line  = lines[ node.loc.end.line ];

			if ( typeof line === 'string' ) {
				line = line.trim();
			}

			if ( line
			&&   node.properties
			&&   node.properties.length
			&&   node.parent.type !== 'Property'
			&&   node.parent.type !== 'ArrayExpression'
			&&   !line.match( '^[\\}\\)\\]]' ) ) {

				if ( node.parent.type === 'CallExpression' ) {
					var targetNode = node.parent.parent;

					while ( targetNode ) {

						switch ( targetNode.type ) {
							case 'Property' : {
								return;
							}

							case 'Program' :
							case 'VariableDeclaration' : {
								context.report( node, 'A newline is required after a ArrayExpression' );

								return;
							}

							default : {
								targetNode = targetNode.parent;
							}
						}
					}

				} else {
					context.report( node, 'A newline is required after a ArrayExpression' );
				}
			}
		},
		'ObjectExpression' : function ( node ) {

			var rawSource = context.getSourceCode();

			var lines = rawSource.getText().replace( /\r/g, '' ).split( '\n' );
			var line  = lines[ node.loc.end.line ];

			if ( typeof line === 'string' ) {
				line = line.trim();
			}

			if ( line
			&&   node.properties
			&&   node.properties.length
			&&   node.parent.type !== 'Property'
			&&   node.parent.type !== 'ArrayExpression'
			&&   !line.match( '^[\\}\\)\\]]' ) ) {

				if ( node.parent.type === 'CallExpression' ) {
					var targetNode = node.parent.parent;

					while ( targetNode ) {

						switch ( targetNode.type ) {
							case 'Property' : {
								return;
							}

							case 'Program' :
							case 'VariableDeclaration' : {
								context.report( node, 'A newline is required after a ObjectExpression' );

								return;
							}

							default : {
								targetNode = targetNode.parent;
							}
						}
					}

				} else {
					context.report( node, 'A newline is required after a ObjectExpression' );
				}
			}
		},
		'BlockStatement' : function ( node ) {

			var rawSource = context.getSourceCode();
			var source    = context.getSourceCode( node );

			var lines = rawSource.getText().replace( /\r/g, '' ).split( '\n' );
			var line  = lines[ node.loc.end.line ];

			if ( line
			&&   node.properties
			&&   node.properties.length
			&&   !line.trim().match( '^[\\}\\)\\]]' ) ) {

				if ( !( node.parent.type === 'TryStatement'
				&&      source.getTokenAfter( node ).value === 'catch' )
				&&   !( node.parent.type === 'CatchClause'
				&&      source.getTokenAfter( node ).value === 'finally' )
				&&   !( node.parent.type === 'IfStatement'
				&&     source.getTokenAfter( node ).value === 'else' ) ) {

					context.report( node, 'A newline is required after a BlockStatement' );
				}
			}
		}
	};
};
