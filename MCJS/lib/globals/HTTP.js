'use strict';

// THIS IS JUST A PROTOTYPE

var Thread = java.lang.Thread;
var serverSocket;


var x = new Thread( function () {

	var ServerSocket      = java.net.ServerSocket;
	var PrintWriter       = java.io.PrintWriter;
	var InputStreamReader = java.io.InputStreamReader;
	var BufferedReader    = java.io.BufferedReader;

	var PORT = 8080;
	var CRLF = '\r\n';
	var thread;

	var readLines = function ( bufReader ) {

		var lines = [];

		try {
			var line;

			while ( line = bufReader.readLine() ) {
				lines.push( line );
			}

		} catch ( error ) {}

		return lines;
	};

	var sendBytes = function ( output, line ) {

		output.write( String( line ) );
	};

	var respond = function ( output, status, type, body ) {

		sendBytes( output, status + CRLF );
		sendBytes( output, 'Server: Simple Nashorn HTTP Server' + CRLF );
		sendBytes( output, 'Content-type: ${type}' + CRLF );
		sendBytes( output, 'Content-Length: ${body.length}' + CRLF );
		sendBytes( output, CRLF );
		sendBytes( output, body );
	};

	var httpRequestHandler = function ( socket ) {

		var out       = socket.getOutputStream();
		var output    = new PrintWriter( out );
		var inReader  = new InputStreamReader( socket.getInputStream(), 'utf-8' );
		var bufReader = new BufferedReader( inReader );

		var lines = readLines( bufReader );

		if ( lines.length > 0 ) {
			var header = lines[ 0 ].split( /\b\s+/ );

			if ( header[ 0 ] === 'GET' ) {
				respond( output, 'HTTP/1.0 404 Not Found', 'text/html', 'TEST' );
			}
		}

		output.flush();
		bufReader.close();
		socket.close();
	};

	serverSocket = new ServerSocket( PORT );

	while ( true ) {
		var socket = serverSocket.accept();

		try {
			thread = new Thread( function () {

				httpRequestHandler( socket );
			} );

			thread.start();
			Thread.sleep( 100 );

		} catch ( error ) {
			print( error );
		}
	}
} );

x.start();

MC.command( '/http', function () {

	serverSocket.close();
	x.stop();
} );
