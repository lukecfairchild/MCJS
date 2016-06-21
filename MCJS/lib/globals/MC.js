'use strict';

/**
 * @namespace
 */

var MC = function () {

	this.aliases = [];

	var commandCall = function ( event, command ) {

		for ( var index in this.aliases ) {
			var variables = this.aliases[ index ].variables;
			var defaults  = this.aliases[ index ].defaults;
			var matches   = command.match( new RegExp( this.aliases[ index ].regex, 'i' ));
			var results   = {};

			if ( matches !== null && matches[ 0 ] ) {

				for ( var i in variables ) {
					results[ variables[ i ] ] = matches[ Number( i ) + 1 ];
				}

				for ( var defaultVar in defaults ) {

					if ( results[ defaultVar ] === '' ) {
						results[ defaultVar ] = defaults[ defaultVar ];
					}
				}

				event.arguments = results;

				this.aliases[ index ].callBack( event );
			}
		}
	}.bind( this );

	this.on( 'server.ServerCommandEvent', function ( event ) {

		var command	= '/' + event.getCommand();

		if ( this.commandExists( command ) ) {
			event.getPlayer = function () {

				return require( '../Class/Console.js' );
			};

			event.setCancelled( true );
			commandCall( event, command );
		}
	}.bind( this ) );


	this.on( 'player.PlayerCommandPreprocessEvent', function ( event ) { 

		var command	= event.getMessage();

		if ( this.commandExists( command ) ) {

			event.getCommand = function () {

				return this.getMessage();
			}.bind( event );

			event.setCancelled( true );
			commandCall( event, command );
		}
	}.bind( this ) );
};


/**
 * @property MC
 * @param {String} message - Message to send all players
 */

MC.prototype.broadcast = function ( message ) {

	console.log( message );

	var players = this.getPlayers();

	for ( var i in players ) {
		players[ i ].sendMessage( message );
	}
};


/**
 * @property MC
 * @param {string} username/uuid - Player username or uuid.
 * @return {Player}
 */

MC.prototype.getPlayer = function ( username ) {

	var Player = require( '../Class/Player.js' );

	var uuid;
	var player;

	try {
		uuid = java.util.UUID.fromString( username );

	} catch ( error ) {}

	if ( uuid ) {
		player = org.bukkit.Bukkit.getPlayer( uuid )
			|| org.bukkit.Bukkit.getOfflinePlayer( uuid );
	}

	if ( !player ) {
		player = org.bukkit.Bukkit.getPlayer( username );
	}

	if ( !player ) {
		player = org.bukkit.Bukkit.getOfflinePlayer( username );
	}

	return new Player( player.getPlayer() || player );
};


/**
 * @property MC
 * @param {String} [world] - World name.
 * @return [ {Player} ]
 */

MC.prototype.getPlayers = function ( world ) {

	var Player = require( '../Class/Player.js' );

	var players = [];

	var players = org.bukkit.Bukkit.getOnlinePlayers();

	try {
		var iterator    = rawPlayers.iterator();
		var playerCount = rawPlayers.size();

		if ( world ) {

			for ( var i = 0; i < playerCount; i++ ) {
				var instance = iterator.next();

				if ( instance.getWorld().getName() === world ) {
					players.push( new Player( instance ) );	
				}
			}

		} else {
			for ( var i = 0; i < playerCount; i++ ) {
				players.push( new Player( iterator.next() ) );	
			}
		}

	} catch ( error ) {
		// Do Nothing
	}

	return players;
};


/**
* @property MC
* @param {String} eventType - The event you want to trigger your callback.
* @param {Function} callback - This function will be ran every time the target eventType happens.
* @example
* MC.on( 'player.PlayerChatEvent', function ( event ) {
*
* 	var player = event.getPlayer();
*
* 	console.log( player.getUsername() + ' spoke' );
* } );
*/

MC.prototype.on = function ( eventType, callBack /*, [ priority ] */ ) {

	var priority = arguments[ 2 ] || 'HIGHEST';

	var handlerList;
	var eventExecutor;
	var listener = { };
	var result   = { };

	var getHandlerListForEventType = function ( eventType ) {

		var result = null;
		var clazz  = null;

		if ( typeof eventType !== 'string' ) {
			clazz  = eventType.class;
			result = clazz.getMethod( 'getHandlerList' ).invoke( null );

		} else { 
			clazz  = java.lang.Class.forName( 'org.bukkit.event.' + String( eventType ) );
			result = clazz.getMethod( 'getHandlerList' ).invoke( null );
		}

		return result;
	};

	if ( priority === undefined ) {
		priority = org.bukkit.event.EventPriority.HIGHEST;

	} else {
		priority = org.bukkit.event.EventPriority[ priority.toUpperCase() ];
	}

	if ( typeof eventType === 'string' ) {
		var parseObjectParts = eventType.split( '.' );
		var parseObjectLast  = org.bukkit.event;

		for ( var index in parseObjectParts ) {
			parseObjectLast = parseObjectLast[ parseObjectParts[ index ] ];
		}

		handlerList = getHandlerListForEventType( parseObjectLast );

	} else {
		handlerList = getHandlerListForEventType( eventType );
	}

	var eventObject = {};

	var returns  = {};
	var filePath = PATH + '/lib/events/' + eventType + '.js';
	var file     = new java.io.File( filePath );
	
	if ( file.exists() ) {
		eventObject = require( filePath );
	}

	eventExecutor = new org.bukkit.plugin.EventExecutor( {
		'execute' : function ( l, event ) {

			var rawMethods = event.getClass().getMethods();

			for ( var i in rawMethods ) {
				var method = rawMethods[ i ].getName().toString();

				if ( eventObject[ method ] === undefined ) {
					returns[ method ] = ( function () {

						var args = [];

						for ( var key in arguments ) {
							args.push( 'arguments[ "' + key + '" ]' );
						}

						return eval( 'event[ this ]( ' + args.join() + ' );' );
					} ).bind( method );

				} else {
					returns[ method ] = eventObject[ method ].bind( event );
				}
			}

			callBack.call( result, returns );
		} 
	} );

	listener.reg = new org.bukkit.plugin.RegisteredListener( null, eventExecutor, priority, MCJS.getInstance(), true );
	handlerList.register( listener.reg );

	result.unregister = function () {

		handlerList.unregister( listener.reg );
	};

	MCJS.addCleanupTask( result.unregister );

	return result;
};


/**
 * @property MC
 * @param {String} alias - The command.
 * @param {Function} callback - This function will be ran every time a player does a command that matches the alias.
 * @example
 * MC.command( '/yay', function ( event ) {
 *
 * 	var player = event.getPlayer();
 *
 * 	console.log( player.getUsername() + ' did /yay' );
 * } );
 */

MC.prototype.command = function( rawAlias, callBack ){

	var alias = ' ' + rawAlias + ' ';

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

	var regexEscape = function ( string ) {

		return string.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' );
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
				[].splice.call( inside, inside.indexOf( '\\' ), 1 );
				//inside.splice( inside.indexOf( '\\' ), 1 );

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

					[].splice.call( inside, inside.indexOf( remove[ i ] ), 1 );
					//inside.splice( inside.indexOf( remove[ i ] ), 1 );
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

					if ( inside.length !== 0 ) {

						for ( var i in inside ) {
							currentObject.type.push( parser[ inside[ i ] ].type );
						}

					} else {
						currentObject.type.push( 'text' );

						if ( inside.indexOf( '[' ) > -1 ) {
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

	if ( !commandArray.length ) {
		commandArray.push( {
			'value' : alias,
			'type'  : [
				'text'
			]
		} );
	}

	// Generate Regex from object
	var rawRegex  = '';
	var variables = [];
	var defaults  = {};

	for ( var i in commandArray ) {
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

	this.aliases.push( {
		'variables' : variables,
		'defaults'  : defaults,
		'alias'     : alias,
		'regex'     : rawRegex,
		'callBack'  : callBack
	} );
};


/**
 * Returns true or false depending on if a alias identical to this has already been made.
 * @property MC
 * @param {String} alias - The command.
 * @return {Boolean}
 * @example
 * var commandExist = MC.commandExists( '/yay' );
 */

MC.prototype.commandExists = function ( command ) {

	for ( var index in this.aliases ) {
		var matches = command.match( new RegExp( this.aliases[ index ].regex, 'i' ) );

		if ( matches !== null && matches[ 0 ] ) {
			return true;
		}
	}

	return false;
};


module.exports = new MC();
