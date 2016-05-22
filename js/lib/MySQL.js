'use strict';

var Database = function () {

	this.connections = {};
};

Database.prototype.connect = function ( database, options ) {

	if ( typeof options !== 'object' ) {
		throw new Error( 'Error in MySQL.connect( \'' + database + '\', options ): Invalid options parameter type:'
			+ ( typeof options )
		);
	}

	if ( options.username === undefined ) {
		throw new Error( 'Error in MySQL.connect( \'' + database + '\', options ): options.username is required' );
	}

	if ( options.password === undefined ) {
		throw new Error( 'Error in MySQL.connect( \'' + database + '\', options ): options.password is required' );
	}

	if ( options.database === undefined ) {
		throw new Error( 'Error in MySQL.connect( \'' + database + '\', options ): options.database is required' );
	}

	if ( options.url === undefined ) {
		throw new Error( 'Error in MySQL.connect( \'' + database + '\', options ): options.url is required' );
	}

	if ( options.url.match( /:[0-9]+$/ ) ) {
		options.port = '';

	} else {
		options.port = ':' + ( options.port || 3306 );
	}

	var Properties = Java.type( 'java.util.Properties' );
	var Driver     = Java.type( 'com.mysql.jdbc.Driver' );
	var driver     = new Driver();
	var properties = new Properties();
	var connection = null;

	try {
		properties.setProperty( 'user',     options.username );
		properties.setProperty( 'password', options.password );

		connection = driver.connect( 'jdbc:mysql://' + options.url + options.port + '/' + options.database, properties );

		var Cleanup = require( '../lib/Cleanup.js' );

		Cleanup.add( function () {

			connection.close();
		} );

		this.connections[ database ] = connection;

	} finally {
		// Do Nothing
	}
};
 
Database.prototype.query = function ( database, query, args ) {

	if ( !this.connections[ database ] ) {
		throw new Error( 'Error in MySQL.query( \'' + database + '\', query ): invalid database connection' );
	}

	var indexes = [];

	var i = -1;

	while ( ( i = query.indexOf( '?', i + 1 ) ) >= 0 ) {
		indexes.push( i );
	}

	args = args || [];

	if ( args.length !== indexes.length ) {
		throw new Error( 'Error in MySQL.query( \'' + database + '\', query ): number of arguments does not match number of replacements' );
	}

	for ( var i = args.length - 1; i > -1; i-- ) {
		var arg   = args[ i ].replace( /\\/g, '\\\\' ).replace( /'/g, '\\\'' );
		var index = indexes[ i ];

		query = query.substr( 0, index ) + '\'' + arg + '\'' + query.substr( index + 1 );
	}

	var results = [];

	var resultSet;
	var statement;

	try {
		statement = this.connections[ database ].prepareStatement( query );

		if ( statement.execute() ) {
			resultSet = statement.getResultSet();

			resultSet.last();

			var resultAmount = resultSet.getRow();

			resultSet.first();

			var meta         = resultSet.getMetaData();
			var columnAmount = meta.getColumnCount();

			var columns = [];

			for ( var i = 1; i < columnAmount + 1; i++ ) {
				columns.push(  meta.getColumnName( i ) );
			}

			for ( var resultIndex = 1; resultIndex < resultAmount + 1; resultIndex++ ) {

				var object = {};

				for ( var i in columns ) {
					var column = columns[ i ];

					object[ column ] = resultSet.getString( columns[ i ] );
				}

				results.push( object );

				if ( resultIndex !== resultAmount ) {
					resultSet.next();
				}
			}
		}
		
	} finally {

		if ( resultSet ) {

			try {
				resultSet.close();
			} catch ( error ) {
				// Do Nothing
			}
		}

		if ( statement ) {

			try {
				statement.close();
			} catch ( error ) {
				// Do Nothing
			}
		}
	}

	return results;
};

module.exports = new Database();
