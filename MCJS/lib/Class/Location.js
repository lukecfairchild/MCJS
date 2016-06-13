'use strict';

/**
 * @constructor
 * @return {Object} Location
 * @return {Number} Location.x
 * @return {Number} Location.y
 * @return {Number} Location.z
 * @return {Number} Location.yaw
 * @return {Number} Location.pitch
 * @return {String} Location.world
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
