'use strict';

var HumanEntity = new Class( function ( bukkitObject ) {

	Object.defineProperty( this, 'bukkit', {
		'enumerable' : false,
		'value'      : bukkitObject
	} );
} );

HumanEntity.extends( require( './Entity.js' ) );

HumanEntity.prototype.getEnderChest = function () {

	return this.bukkit.getEnderChest();
};


module.exports = HumanEntity;
