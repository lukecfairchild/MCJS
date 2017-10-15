'use strict';

var LivingEntity = new Class( function ( bukkitObject ) {

	Object.defineProperty( this, 'bukkit', {
		'enumerable' : false,
		'value'      : bukkitObject
	} );
} );

LivingEntity.prototype.getEyeLocation = function () {

	var Location = require( './Location.js' );

	return new Location( this.bukkit.getEyeLocation() );
};


module.exports = LivingEntity;
