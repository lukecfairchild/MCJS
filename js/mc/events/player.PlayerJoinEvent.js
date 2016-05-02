'use strict';

module.exports.getPlayer = function () {

	var Player = require( '../../Class/Player.js' );

	return new Player( this.getPlayer() );
};
