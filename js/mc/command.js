'use strict';

var aliases	= [];

var regexEscape = function ( string ) {

	return string.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' );
};

var commandCreate = function( alias, callBack ){

	///////////////// Parser Object /////////////////
	var parser = {
		'$' : {
			'type'      : 'variable',
			'whitelist' : null,
			'blacklist' : null,
			'closers'   : [
				' ',
				']',
				'[',
				'='
			]
		},
		'[' : {
			'type'      : 'optional',
			'whitelist' : null,
			'blacklist' : [
				'"',
				'\''
			],
			'closers'   : [ ']' ]
		},
		'\'' : {
			'type'      : 'string',
			'whitelist' : [ '[' ],
			'blacklist' : [ '"' ],
			'closers'   : [ '\'' ]
		},
		'"' : {
			'type'      : 'string',
			'whitelist' : [ '[' ],
			'blacklist' : [ "'" ],
			'closers'   : [ '"' ]
		}
	};

	///////////////// Parse Command /////////////////
	var commandArray  = [];
	var currentObject = {};
	var inside        = [];
	var stringArray   = alias.split( '' );

	for ( var index in stringArray ) {
		var hold    = [];
		var char    = stringArray[ index ];

		if ( char === '\\'
		&&   !( inside.indexOf( '\\' ) > -1 ) ) {

			inside.push( '\\' );

		} else {
			var changed;

			if ( inside.indexOf( '\\' ) > -1 ) {
				inside.splice( inside.indexOf( '\\' ), 1 );

			} else {
				// Check to see if current groups get closed
				var remove = [];

				for( var i in inside ) {
					var closers = parser[ inside[ i ] ].closers;

					if ( closers.indexOf( char ) > -1 ) {
						remove.push( inside[ i ] );
						changed	= true;
					}
				}

				for ( var i in remove ) {
		
					// Check for wildcard variables
					if ( remove[ i ] === '$'
					&&   currentObject.value === undefined ) {

						var value = '$';
						var type  = [ 'variable.wild' ];

						if ( remove.indexOf( '[' ) > -1
						||   inside.indexOf( '[' ) > -1 ) {

							type.push( 'optional' );
						}

						commandArray.push( {
							'value' :	value,
							'type'  :	type
						} );
					}

					inside.splice( inside.indexOf( remove[ i ] ), 1 );
				}

	            // Check if character starts a group and has not been started
	            if ( parser[ char ]
	            &&   !( inside.indexOf( char ) > -1 ) ) {

					var denied		= false;
					var blacklist	= parser[ char ].blacklist;
					var whitelist	= parser[ char ].whitelist;
	                
					// Check if new group is in blacklist
					if ( blacklist !== null ) {

						for ( var i in inside ) {

							if ( blacklist.indexOf( inside[ i ] ) > -1 ) {
								denied	= true;
							}
						}
					}
	               
					// Check if new group is in whitelist
					if ( whitelist !== null ) {

						for( var i in whitelist ) {

							if ( !inside.indexOf( whitelist[ i ] ) > -1 ) {
								denied = true;
							}
						}
					}

					if ( !denied
					&&   !remove.indexOf( char ) > -1 ) {

						changed	= true;

						hold.push( char );
					}
				}
			}

			// Group changed
			if ( changed ) {

				if ( currentObject.value
				&&   !( currentObject.type.indexOf( 'text' ) > -1
				&&      currentObject.type.indexOf( 'optional' ) > -1 ) ) {

					commandArray.push( { 
						'value' : currentObject.value, 
						'type'  : currentObject.type
					} );
				}

				var currentObject = {};

				changed = false;

				if ( char === ' ' ) {
					currentObject.type	= [];
					currentObject.value	= char;

					currentObject.type.push( 'text' );

					if ( inside.indexOf( '[' ) > -1 ) {
						currentObject.type.push( 'optional' );
					}
				}

			} else {
				if ( !currentObject.value ) {
					currentObject.type	= [];
					currentObject.value	= char;

					if( inside.length !== 0 ){

						for ( var i in inside ) {
							currentObject.type.push( parser[ inside[ i ] ].type );
						}

					} else {
						currentObject.type.push( 'text' );

						if( inside.indexOf( '[' ) > -1 ) {
							currentObject.type.push( 'optional' );
						}
					}

				} else {
					currentObject.value	+= char;
				}

				if ( index === stringArray.length - 1 ) {
					commandArray.push( { 
						'value' : currentObject.value, 
						'type'  : currentObject.type
					} );
				}
			}

			// Append new groups
			if ( hold.length > 0 ) {

				for ( var i in hold ) {
					inside.push( hold[ i ] );
				}
			}

			if ( index === stringArray.length - 1
			&&   char === '$'
			&&   !inside.indexOf( '"' ) > -1
			&&   !inside.indexOf( '\'' ) > -1 ) {

				var arrayType = [];

				arrayType.push( 'variable.wild' );

				if( inside.indexOf( '[' ) > -1 ) {
					arrayType.push( 'optional' );
				}

				commandArray.push( { 
					'value' : '$', 
					'type'  : arrayType
				} );
			}
		}
	}

	// Generate Regex from object
	var rawRegex  = '';
	var variables = [];
	var defaults  = {};

	for( var i in commandArray ){
		var value = commandArray[ i ].value;
		var type  = commandArray[ i ].type;

		 if ( type.indexOf( 'variable.wild' ) > -1 ) {

		 	if ( variables.indexOf( value ) > -1 ) {
				throw new Error( 'Duplicate variable name: ' + value );

		 	} else {
				variables.push( value );
			}

			if ( type.indexOf( 'optional' ) > -1 ) {
				rawRegex += '(.*?)[ ]*$';

			} else {
				rawRegex += '(.+?)[ ]*$';
			}

			rawRegex += '(?:[ ]+|[ ]*$)';

		} else if( type.indexOf( 'text' ) > -1 ) {

			if ( value !== ' ' ) {
				rawRegex += regexEscape( value ).replace( new RegExp( '(^[ ]*|[ ]*$)', 'g' ), '' ) + '(?:[ ]+|[ ]*$)';
			}

		} else if ( type.indexOf( 'variable' ) > -1 ) {

			if ( variables.indexOf( value ) > -1 ) {
				throw new Error( 'Duplicate variable name: ' + value );

		 	} else {
				variables.push( value );
			}

			if ( type.indexOf( 'optional' ) > -1 ) {
				rawRegex += '([^ ]*)(?:[ ]+|[ ]*$)';

			} else {
				rawRegex += '([^ ]+)(?:[ ]+|[ ]*$)';
			}

		} else if ( type.indexOf( 'string' ) > -1 ) {
			defaults[ variables[ variables.length - 1 ] ] = value;
		}
	}

	rawRegex += '[ ]*$';

	aliases.push( {
		'variables' : variables,
		'defaults'  : defaults,
		'alias'     : alias,
		'regex'     : rawRegex,
		'callBack'  : callBack
	} );
};

var commandCall = function ( event, command, player ) {

	for ( var index in aliases ) {
		var variables = aliases[ index ].variables;
		var defaults  = aliases[ index ].defaults;
		var matches   = command.match( new RegExp( aliases[ index ].regex, 'i' ));
		var results   = {};

		if ( matches !== null ) {

			for ( var i in variables ) {
				results[ variables[ i ] ] = matches[ Number( i ) + 1 ];
			}

			for ( var defaultVar in defaults ) {

				if ( results[ defaultVar ] === '' ) {
					results[ defaultVar ] = defaults[ defaultVar ];
				}
			}

			aliases[ index ].player = player;

			event.arguments = results;

			aliases[ index ].callBack( event );
		}
	}
};

var commandExists = function ( command ) {

	for ( var index in aliases ) {
		var matches = command.match( new RegExp( aliases[ index ].regex, 'i' ) );

		if( matches !== null ){
			return true;
		}
	}

	return false;
};

var on = require( './on.js' );

on( 'server.ServerCommandEvent', function ( event ) {

	var command	= '/' + event.getCommand();

	if ( commandExists( command ) ) {
		event.setCancelled( true );
		commandCall( event, command, '' );
	}
} );

on( 'player.PlayerCommandPreprocessEvent', function ( event ) { 

	var command	= '/' + event.getMessage();

	if ( commandExists( command ) ) {

		event.getCommand = function () {

			return this.getMessage();
		}.bind( event );

		event.setCancelled( true );
		commandCall( event, command, '' );
	}
} );

module.exports = commandCreate;
