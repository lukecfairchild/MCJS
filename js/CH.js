'use strict';

var CH = function () {

	this.private.globalEnv = null;
	this.private.functions = {};

	var environmentsField = commandHelperEnvironment.getClass().getDeclaredField( 'environments' );

	environmentsField.setAccessible( true );

	var envMap  = environmentsField.get( commandHelperEnvironment );
	var envKeys = envMap.keySet().toArray();

	for ( var index in envKeys ) {

		if ( envKeys[ index ].getName().equals( 'com.laytonsmith.core.environments.GlobalEnv' ) ) {
			this.private.globalEnv = envMap.get( envKeys[ index ] );
		}
	}

	if ( this.private.globalEnv === null ) {
		throw new Error( 'Unable to find an environment.' );
	}

	var funcs    = com.laytonsmith.core.extensions.ExtensionManager.GetFunctions( null );
	var iterator = funcs.iterator();

	for ( var i = 0; i < funcs.size(); i++ ) {
		var instance = iterator.next();
		this.private.functions[ instance.getName() ] = instance;
	}
};

/*==================================================*\
 *					Private Methods					*
\*==================================================*/
Object.defineProperty( CH.prototype, 'private', {
	'enumerable' : false,
	'value'      : {}
} );
CH.prototype.private.execute = function () {

	var varName = arguments[ 0 ];
	var args    = [].splice.call( arguments, 1, arguments.length - 1 );
	// var args    = arguments.splice( 1, arguments.length - 1 );

	if ( this.private.globalEnv.GetVarList().has( varName ) ) {

		try {
			this.private.globalEnv.GetVarList().get( varName, null ).ival().execute( new CString( JSON.stringify( args ), Target.UNKNOWN ) );

		} catch ( error ) {
			return error.getReturn();
		}

	} else {
		throw new Error( 'Unable to find the ' + varName + ' variable. Please define it in MethodScript before calling this javascript file.' );
	}
}.bind( CH.prototype );
CH.prototype.private.getValue = function ( object ) {

	var type  = object.getClass().getName();
	var types = {
		'com.laytonsmith.core.constructs.CBoolean' : 'getBoolean',
		'com.laytonsmith.core.constructs.CString'  : 'val',
		'com.laytonsmith.core.constructs.CDouble'  : 'getDouble',
		'com.laytonsmith.core.constructs.CInt'     : 'getInt',
		'com.laytonsmith.core.constructs.CArray'   : 'asList',
		'com.laytonsmith.core.constructs.CNull'    : null
	};

	if ( types[ type ] !== undefined ) {

		if ( type === 'com.laytonsmith.core.constructs.CNull' ) {
			return null;
		}

		if ( type === 'com.laytonsmith.core.constructs.CArray' ) {

			if ( object.isAssociative() ) {

				var size     = object.keySet().size();
				var iterator = object.keySet().iterator();
				var returns  = {};

				for ( var i = 0; i < size + 1; i ++ ) {

					if ( iterator.hasNext() ) {
						var keyRaw = iterator.next();
						var key    = this.private.getValue( keyRaw );
						var value  = this.private.getValue( object.get( keyRaw, Target.UNKNOWN ) );

						returns[ key ] = value;
					}
				}

				return returns;

			} else {
				var returns  = [];
				var rawArray = object.asList()

				for ( var index in rawArray ) {
					returns.push( this.private.getValue( rawArray[ index ] ) );
				}

				return returns;
			}

		} else {
			return object[ types[ type ] ]();
		}

	} else {
		throw new error( 'Error in: CH.js: CH.prototype.private.getValue(): Unimplimented type: ' + type );
	}

}.bind( CH.prototype );


/*==================================================*\
 *					Public Methods					*
\*==================================================*/
CH.prototype.eval = function ( code ) {

	return JSON.parse( this.private.execute( '@eval', code ) ).value;
};
CH.prototype.time = function () {

	return java.lang.System.currentTimeMillis();
};
CH.prototype.nanoTime = function () {

	return java.lang.System.nanoTime();
};
CH.prototype.pinfo = function ( player ) {

	var pinfo = this.private.getValue( this.private.functions.pinfo.exec( Target.UNKNOWN, commandHelperEnvironment, new CString( player, Target.UNKNOWN ) ) );

	return {
		'username'    : pinfo[ 0 ],  // 0 - player's name; This will return the player's exact name, even if called with a partial match.
		'display'     : pinfo[ 4 ],  // 4 - Display name; The name that is used when the player's name is displayed on screen typically.

		'health'      : pinfo[ 5 ],  // 5 - player's health; Gets the current health of the player, which will be an int from 0-20.
		                             // 7 - World name; Gets the name of the world this player is in.
		'op'          : pinfo[ 8 ],  // 8 - Is Op; true or false if this player is an op.
		'groups'      : pinfo[ 9 ],  // 9 - player groups; An array of the permissions groups the player is in.

		'ip'          : pinfo[ 3 ],  // 3 - player's IP; Returns the IP address of this player.
		'host'        : pinfo[ 12 ], // 12 - Host; The host the player connected to.
		'hostname'    : pinfo[ 10 ], // 10 - The player's hostname (or IP if a hostname can't be found)

		'uuid'        : pinfo[ 13 ], // 13 / 20 - Player UUID

		'currentSlot' : pinfo[ 15 ], // 15 - The slot number of the player's current hand.
		'itemInHand'  : pinfo[ 6 ],  // 6 - Item in hand; The value returned by this will be similar to the value returned by get_block_at()

		'isBlocking'  : pinfo[ 17 ], // 17 - Is blocking?
		'isFlying'    : pinfo[ 18 ], // 18 - Is flying?
		'isSleeping'  : pinfo[ 16 ], // 16 - Is sleeping?
		'isSneaking'  : pinfo[ 11 ], // 11 - Is sneaking?
		'isSprinting' : pinfo[ 19 ], // 19 - Is sprinting?
		'inVehicle'   : pinfo[ 14 ], // 14 - Is player in a vehicle? Returns true or false.

		'cursor'      : pinfo[ 2 ],  // 2 - player's cursor; an array of the location of the player's cursor, or null if the block is out of sight.
		'location'    : {            // 1 - player's location; an array of the player's xyz coordinates
			'x'     : pinfo[ 1 ][ 0 ],
			'y'     : pinfo[ 1 ][ 1 ],
			'z'     : pinfo[ 1 ][ 2 ],
			'world' : pinfo[ 7 ]
		}
	};
};
CH.prototype.players = function () {

	return this.private.getValue( this.private.functions.all_players.exec( Target.UNKNOWN, commandHelperEnvironment ) );
};
CH.prototype.pinv = function ( player ) {

	return this.private.getValue( this.private.functions.pinv.exec( Target.UNKNOWN, commandHelperEnvironment, new CString( player, Target.UNKNOWN ) ) );
};
CH.prototype.ploc = function ( player ) {

	var ploc = this.private.getValue( this.private.functions.ploc.exec( Target.UNKNOWN, commandHelperEnvironment, new CString( player, Target.UNKNOWN ) ) );

	return {
		'x'     : ploc.x,
		'y'     : ploc.y,
		'z'     : ploc.z,
		'world' : ploc.world,
		'yaw'   : ploc.yaw,
		'pitch' : ploc.pitch
	};
};

module.exports = new CH();
