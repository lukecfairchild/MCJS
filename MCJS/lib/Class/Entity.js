'use strict';

var Entity = new Class( function ( bukkitObject ) {

	Object.defineProperty( this, 'bukkit', {
		'enumerable' : false,
		'value'      : bukkitObject
	} );
} );


Entity.prototype.remove = function () {

	this.bukkit.remove();
};

Entity.prototype.getUUID = function () {

	return this.bukkit.getUniqueId().toString();
};


module.exports = Entity;
