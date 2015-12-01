'use strict';

module.exports = function ( event ) {

	return {
		'message'  : event.getMessage(),
		'recipients'  : event.getRecipients().toArray(),
		'state'       : event.isCancelled(),
		'setState'    : function ( state ) {

			event.setCancelled( state );
		},
		'setPlayer'   : function ( player ) {

			event.setPlayer( /* this needs a bukkit player object */ );
		},
		'setMessage'  : function ( message ) {

			event.setMessage( message );
		}
	};
};
