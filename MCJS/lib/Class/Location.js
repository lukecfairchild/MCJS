'use strict';


/**
 * @constructor
 * @return {LocationObject}
 */

var Location = function ( location ) {


	/**
	 * @implements {LocationObject}
	 * @typedef LocationObject
	 * @property {Number} x
	 * @property {Number} y
	 * @property {Number} z
	 * @property {Number} yaw
	 * @property {Number} pitch
	 * @property {String} world
	 */

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
