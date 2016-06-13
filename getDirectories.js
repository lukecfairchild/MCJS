'use strict';

var fs   = require( 'fs' );
var path = require( 'path' );

var jsonAlign = ( function () {

	var enclosure = '\"';

	var gap;
	var rep;
	var indent;

	// var cx        = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

	var meta = {    // table of character substitutions
		'\b' : '\\b',
		'\t' : '\\t',
		'\n' : '\\n',
		'\f' : '\\f',
		'\r' : '\\r',
		'\\' : '\\\\'
	};

	meta[ enclosure ] = '\\' + enclosure;

	var quote = function ( string ) {

		// If the string contains no control characters, no quote characters, and no
		// backslash characters, then we can safely slap some quotes around it.
		// Otherwise we must also replace the offending characters with safe escape
		// sequences.
		escapable.lastIndex = 0;
		return escapable.test( string ) ? enclosure + string.replace( escapable, function ( a ) {

			var c = meta[ a ];

			return typeof c === 'string'
				? c
				: '\\u' + ( '0000' + a.charCodeAt( 0 ).toString( 16 ) ).slice( -4 );
		} ) + enclosure : enclosure + string + enclosure;
	};

	var str = function ( key, holder, alignAllValues ) {

		// Produce a string from holder[key].

		var i;          // The loop counter.
		var j;          // The second loop counter.
		var k;          // The member key.
		var v;          // The member value.

		var max;
		var start;
		var length;
		var partial;

		var mind  = gap;
		var value = holder[ key ];


		// If the value has a toJSON method, call it to obtain a replacement value.
		if ( value
			&& typeof value === 'object'
			&& typeof value.toJSON === 'function' 
		) {
			value = value.toJSON( key );
		}

		// If we were called with a replacer function, then call the replacer to
		// obtain a replacement value.
		if ( typeof rep === 'function' ) {
			value = rep.call( holder, key, value );
		}

		// What happens next depends on the value's type.
		switch ( typeof value ) {
			case 'function' : {
				return '[FUNCTION]';
			}

			case 'string' : {
				return quote( value );
			}

			case 'number' : {
				// JSON numbers must be finite. Encode non-finite numbers as null.
				return isFinite( value ) ? String( value ) : 'null';
			}

			case 'boolean' :
			case 'null' : {
				// If the value is a boolean or null, convert it to a string. Note:
				// typeof null does not produce 'null'. The case is included here in
				// the remote chance that this gets fixed someday.
				return String( value );
			}

			// If the type is 'object', we might be dealing with an object or an array or
			// null.
			case 'object' : {
				// Due to a specification blunder in ECMAScript, typeof null is 'object',
				// so watch out for that case.
				if ( !value ) {
					return 'null';
				}

				// Make an array to hold the partial results of stringifying this object value.
				gap     += indent;
				partial  = [];

				// Is the value an array?
				if ( Object.prototype.toString.apply( value ) === '[object Array]' ) {

					// The value is an array. Stringify every element. Use null as a placeholder
					// for non-JSON values.
					length = value.length;

					for ( i = 0; i < length; i += 1 ) {
						partial[ i ] = str( i, value ) || 'null';
					}

					// Join all of the elements together, separated with commas, and wrap them in
					// brackets.
					v = partial.length === 0
						? '[]'
						: gap
						? '[\n' + gap + partial.join( ',\n' + gap ) + '\n' + mind + ']'
						: '[' + partial.join( ',' ) + ']';
					gap = mind;
					return v;
				}

				// If the replacer is an array, use it to select the members to be stringified.
				if ( rep && typeof rep === 'object' ) {

					length = rep.length;

					for ( i = 0; i < length; i += 1 ) {

						if ( typeof rep[ i ] === 'string' ) {
							k = rep[ i ];
							v = str( k, value );

							if ( v ) {
								partial.push( {
									'k' : quote( k ),
									'v' : v
								} );
							}
						}
					}

				} else {

					// Otherwise, iterate through all of the keys in the object.
					for ( k in value ) {

						if ( Object.prototype.hasOwnProperty.call( value, k ) ) {
							v = str( k, value );

							if ( v ) {
								partial.push( {
									'k' : quote( k ),
									'v' : v
								} );
							}
						}
					}
				}

				// Join all of the member texts together, separated with commas,
				// and wrap them in braces.  If indentation has been requested,
				// line up all the values on the same column.
				if ( gap ) {
					start = false;

					for ( i = 0; i <= partial.length; i++ ) {

						if ( i === partial.length || /\n/.test( partial[ i ].v ) ) {

							if ( i === partial.length
							&&   alignAllValues ) {

								start = 0;
							}

							if ( start !== false ) {
								max = 0;

								for ( j = start; j <= i; j++ ) {

									if ( j < partial.length ) {
										max = Math.max( max, partial[ j ].k.length );
									}
								}

								for ( j = start; j <= i; j++ ) {

									if ( j < partial.length ) {
										partial[ j ].k += new Array( max - partial[ j ].k.length + 1 ).join( ' ' );
									}
								}

								start = false;
							}

						} else {
							if ( start === false
							&&   !alignAllValues ) {

								start = i;
							}
						}
					}
				}

				for ( i in partial ) {
					partial[ i ] = partial[ i ].k + ( gap ? ' : ' : ':' ) + partial[ i ].v;
				}

				v = partial.length === 0
					? '{}'
					: gap
					? '{\n' + gap + partial.join( ',\n' + gap ) + '\n' + mind + '}'
					: '{' + partial.join( ',' ) + '}';
				gap = mind;

				return v;
			}
		}
	};

	return function ( value, rawReplacer, rawSpace, rawAlignAllValues ) {

		// The stringify method takes a value and an optional replacer, and an optional
		// space parameter, and returns a JSON text. The replacer can be a function
		// that can replace values, or an array of strings that will select the keys.
		// A default replacer method can be provided. Use of the space parameter can
		// produce text that is more easily readable.

		// This version also accepts an alignAllValues parameter.  Normally, a new
		// alignment group will be started each time an array or object value is
		// encountered.  If this option is set to true, then each object will have all
		// of its values aligned together.
		var i;
		var space          = rawSpace;
		var replacer       = rawReplacer;
		var alignAllValues = rawAlignAllValues;
		gap = '';
		indent = '	';

		// Since this module aligns JSON strings, set a default number of spaces so
		// the output will always be indented.
		if ( space === undefined ) {
			space = 4;
		}

		// If the space parameter is a number, make an indent string containing that
		// many spaces.
		if (typeof space === 'number') {
			for (i = 0; i < space; i += 1) {
				//indent += ' ';
			}

		// If the space parameter is a string, it will be used as the indent string.
		} else if (typeof space === 'string') {
			indent = space;
		}

		// If there is a replacer, it must be a function or an array (or boolean,
		// in which case the value will be used for alignAllValues).
		// Otherwise, throw an error.
		if ( replacer
			&& typeof replacer !== 'function'
			&& ( typeof replacer !== 'object'
				|| typeof replacer.length !== 'number'
			)
		) {

			if ( typeof replacer === 'boolean' ) {
				alignAllValues = replacer;
				replacer       = null;

			} else {
				throw new Error( 'JSON.stringify' );
			}
		}

		rep = replacer;

		// Make a fake root object containing our value under the key of ''.
		// Return the result of stringifying the value.
		return str( '', {
			'' : value
		}, alignAllValues );
	};
} )();

var getDirectories = function ( dirPath ) {

	return fs.readdirSync( dirPath ).filter( function ( file ) {

		return fs.statSync( path.join( dirPath, file ) ).isDirectory();
	} );
};

var dirs = [
	'./MCJS'
];

for ( var i = 0; i < dirs.length; i++ ) {
	var dir = dirs[ i ];

	var newTargets = getDirectories( dir );

	for ( var j in newTargets ) {
		dirs.push( dir + '/' + newTargets[ j ] );
	}
}

var fileName = 'JSDocConf.json';

var config = JSON.parse( fs.readFileSync( fileName, 'utf-8' ) );

config.source.include = dirs;

fs.writeFileSync( fileName, jsonAlign( config ), 'utf-8' );

/*
			"./MCJS/lib/globals/mc/events",
			"./MCJS/lib/globals/mc",
			"./MCJS/lib/globals",
			"./MCJS/lib/Class",
			"./MCJS/lib"*/