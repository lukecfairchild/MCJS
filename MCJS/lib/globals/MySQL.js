'use strict';

/**
 * MySQL allows you to connect to a MySQL database and make queries to it.
 * @namespace
 */

var MySQL = new Class( function () {

	this.private.connections = {};
} );


/**
 * Allows you to start and store a MySQL database connection for executing queries against.
 * @implements {MySQL}
 * @param {String} database - This is a alias for you to use to refrence a database connection.
 * @param {Object} options - This is the option object for specifying your connection to the MySQL database.
 * @param {String} options.username - Username for connecting to the database.
 * @param {String} options.password - Password for connecting to the database.
 * @param {String} options.database - Database name on the MySQL database.
 * @param {String} options.url - URL to get to the MySQL database.
 * @param {Number} [options.port=3306] - Port for connecting to the MySQL database.
 * @example
 * MySQL.query( 'main', {
 * 	'username' : 'test',
 * 	'password' : 'foo',
 * 	'database' : 'minecraft',
 * 	'url'      : 'localhost'
 * } );
 */

MySQL.prototype.connect = function ( database, options ) {

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

		MCJS.addCleanupTask( function () {

			connection.close();
		} );

		this.private.connections[ database ] = connection;

	} catch ( error ) {
		throw new Error( 'Error in MySQL.query( \'' + database + '\', options ): connection failed: ' + error );
	}
};


/**
 * Allows you to send the specified MySQL database a query, if there is results it will be returned in a array.
 * @implements {MySQL}
 * @param {String} database - Alias for refrencing a database connection.
 * @param {String} query - Query to be sent to the target mysql database.
 * @param {Array} arguments - Arguments to be passed into the query.
 * @return {Array} - This is a array of results if there are any.
 * @example
 * var results = MySQL.query( 'main', 'SELECT * FROM table' );
 */

MySQL.prototype.query = function ( database, rawQuery, rawArgs ) {

	if ( !this.private.connections[ database ] ) {
		throw new Error( 'Error in MySQL.query( \'' + database + '\', query ): invalid database connection' );
	}

	var args    = rawArgs || [];
	var query   = rawQuery;
	var indexes = [];

	var i = -1;

	while ( ( i = query.indexOf( '?', i + 1 ) ) >= 0 ) {
		indexes.push( i );
	}

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
		statement = this.private.connections[ database ].prepareStatement( query );

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
	} catch ( error ) {
		throw new Error( 'Error in MySQL.query( \'' + database + '\', query ): ' + error );
		
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


module.exports = new MySQL();
