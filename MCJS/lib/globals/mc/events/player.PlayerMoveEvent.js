'use strict';

module.exports.getFrom = function () {

	var location = this.getFrom();

	return {
		'x'     : Number( location.getX() ),
		'y'     : Number( location.getY() ),
		'z'     : Number( location.getZ() ),
		'yaw'   : Number( location.getYaw() ),
		'pitch' : Number( location.getPitch() ),
		'world' : location.getWorld().getName()
	};
};

module.exports.getFrom = function () {

	var location = this.getTo();

	return {
		'x'     : Number( location.getX() ),
		'y'     : Number( location.getY() ),
		'z'     : Number( location.getZ() ),
		'yaw'   : Number( location.getYaw() ),
		'pitch' : Number( location.getPitch() ),
		'world' : location.getWorld().getName()
	};
};

module.exports.getPlayer = function () {

	var Player = require( '../../Class/Player.js' );

	return new Player( this.getPlayer() );
};
