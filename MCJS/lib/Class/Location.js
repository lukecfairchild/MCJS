'use strict';

/**
 * @typedef Location
 * @type Object
 * @property {Number} x
 * @property {Number} y
 * @property {Number} z
 * @property {Number} yaw
 * @property {Number} pitch
 * @property {String} world
 */


/**
 * @constructor
 * @return {Location}
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
