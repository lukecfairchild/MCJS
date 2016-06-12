'use strict';

var bkEventPackage = 'org.bukkit.event.';

var getHandlerListForEventType = function ( eventType ) {

	var result = null;
	var clazz  = null;

	if ( typeof eventType !== 'string' ) {
		clazz  = eventType.class;
		result = clazz.getMethod( 'getHandlerList' ).invoke( null );

	} else { 
		clazz  = java.lang.Class.forName( String( bkEventPackage ) + String( eventType ) );
		result = clazz.getMethod( 'getHandlerList' ).invoke( null );
	}

	return result;
};

module.exports = function ( /* eventType, callBack, [ priority ] */ ) {

	var eventType = arguments[ 0 ];
	var callBack  = arguments[ 1 ];
	var priority  = arguments[ 2 ] || 'HIGHEST';

	var handlerList;
	var eventExecutor;
	var listener = { };
	var result   = { };

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
	var filePath = PATH + '/mc/events/' + eventType + '.js';
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

	var Cleanup = require( '../../Cleanup.js' );

	Cleanup.add( result.unregister );

	return result;
};
