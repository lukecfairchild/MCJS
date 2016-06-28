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


module.exports = Entity;
