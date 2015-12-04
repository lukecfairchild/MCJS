'use strict';

var bkEventListener      = org.bukkit.event.Listener;
var bkEventPriority      = org.bukkit.event.EventPriority;
var bkEventExecutor      = org.bukkit.plugin.EventExecutor;
var bkRegisteredListener = org.bukkit.plugin.RegisteredListener;
var bkEventPackage       = 'org.bukkit.event.';
var nashorn              = ( typeof Java != 'undefined' );

var events = {};
var files  = new java.io.File( PATH + '/mc/events' ).listFiles();

for ( var fileIndex in files ) {
	var eventName       = String( files[ fileIndex ] ).match( /([^\\]+)\.js/ )[ 1 ];
	events[ eventName ] = require( files[ fileIndex ] );
}

function getHandlerListForEventType ( eventType ) {

	var result = null;
	var clazz  = null;

	if ( typeof eventType != 'string' ) {

		if ( nashorn ) {
			clazz  = eventType[ 'class' ];
			result = clazz.getMethod( 'getHandlerList' ).invoke( null );

		} else { 
			result = eventType.getHandlerList();
		}

	} else { 

		if ( nashorn ) { 
			clazz  = java.lang.Class.forName( bkEventPackage + '' + eventType );
			result = clazz.getMethod( 'getHandlerList' ).invoke( null );

		} else {
			var eventType2 = eval( bkEventPackage + eventType );
			result         = eventType2.getHandlerList();
		}
	}

	return result;
}

module.exports = function ( /* eventType, callBack, [ priority ] */ ) {

	var eventType = arguments[ 0 ];
	var callBack  = arguments[ 1 ];
	var priority  = arguments[ 2 ] || 'HIGHEST';

	var handlerList;
	var eventExecutor;
	var listener = { };
	var result   = { };

	if ( typeof priority == 'undefined' ) {
		priority = bkEventPriority.HIGHEST;

	} else {
		priority = bkEventPriority[ priority.toUpperCase() ];
	}

	if ( typeof eventType == 'string' ) {
		var parseObjectParts = eventType.split( '.' );
		var parseObjectLast  = org.bukkit.event;

		for ( var index in parseObjectParts ) {
			parseObjectLast = parseObjectLast[ parseObjectParts[ index ] ];
		}

		handlerList = getHandlerListForEventType( parseObjectLast );

	} else {
		handlerList = getHandlerListForEventType( eventType );
	}

	eventExecutor = new bkEventExecutor( {
		'execute' : function ( l, event ) {

			var lastCHReload = com.laytonsmith.core.Globals.GetGlobalConstruct( 'lastReload' ).getInt();

			if ( lastCHReload > loadTime ) {
				Cleanup.trigger();

			} else {
				var returns;

				if ( events[ eventType ] ) {

					returns = events[ eventType ];

					for ( var i in returns ) {
						returns[ i ] = returns[ i ].bind( event );
					}

					var rawMethods = event.getClass().getMethods()
					var methods    = {};

					for ( var i in rawMethods ) {
						var method = rawMethods[ i ].getName().toString();

						if ( !returns[ method ] ) {
							returns[ method ] = ( function () {

								var args = [];

								for ( var i in arguments ) {
									args.push( arguments[ i ] );
								}

								if ( arguments.length ) {
									return event[ this ]( args );

								} else {
									return event[ this ]();
								}
							} ).bind( method );
						}
					}
				} else {
					returns = event;
				}

				callBack.call( result, returns );
			}
		} 
	} );

	listener.reg = new bkRegisteredListener( null, eventExecutor, priority, __plugin, true );
	handlerList.register( listener.reg );

	result.unregister = function () {

		handlerList.unregister( listener.reg );
	};

	Cleanup.add( result.unregister );

	return result;
};

