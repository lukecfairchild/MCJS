'use strict';

module.exports.getRecipients = function () {

	var rawRecipients = this.getRecipients();
	var iterator      = rawRecipients.iterator();
	var size          = rawRecipients.size();
	var recipients    = [];


	for ( var i = 0; i < size + 1; i ++ ) {

		if ( iterator.hasNext() ) {
			recipients.push( iterator.next().getName() );
		}
	}

	return recipients;
};

module.exports.setPlayer = function ( username ) {

	this.setPlayer( org.bukkit.Bukkit.getPlayer( username ) );
};

module.exports.getPlayer = function () {

	return this.getPlayer().getName();
};
