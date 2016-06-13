'use strict';

/**
 * @constructor
 * @return {{x: Number, y: Number, z: Number, yaw: Number, pitch: Number, wolrd: String}} Location
 */
var Location = function ( location ) {

	return {
		'x'     : Number( location.getX() ),
		'y'     : Number( location.getY() ),
		'z'     : Number( location.getZ() ),
		'yaw'   : Number( location.getYaw() ),
		'pitch' : Number( location.getPitch() ),
		'world' : location.getWorld().getName()
	};
};

module.exports = Location;
