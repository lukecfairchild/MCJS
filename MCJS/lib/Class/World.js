'use strict';

var World = new Class( function ( bukkitObject ) {

	Object.defineProperty( this, 'bukkit', {
		'enumerable' : false,
		'value'      : bukkitObject
	} );
} );


World.prototype.getEntities = function () {

	var Entity = require( './Entity.js' );

	var entities = [];

	var rawEntities = this.bukkit.getEntities();

	try {
		var iterator    = rawEntities.iterator();
		var entityCount = rawEntities.size();

		for ( var i = 0; i < entityCount; i++ ) {
			entities.push( new Entity( iterator.next() ) );	
		}

	} catch ( error ) {
		// Do Nothing
	}

	return entities;
};


module.exports = World;
