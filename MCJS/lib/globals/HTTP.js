'use strict';

// THIS IS JUST A PROTOTYPE

var Thread            = java.lang.Thread;
var serverSocket;
var x = new Thread( function () {

	var ServerSocket      = java.net.ServerSocket;
	var PrintWriter       = java.io.PrintWriter;
	var InputStreamReader = java.io.InputStreamReader;
	var BufferedReader    = java.io.BufferedReader;
	var FileInputStream   = java.io.FileInputStream;
	var ByteArray         = Java.type( 'byte[]' );

	var PORT = 8080;
	var CRLF = '\r\n';
	var FOUROHFOUR = ''
	var thread
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

	var httpRequestHandler = function ( socket ) {

		var out       = socket.getOutputStream();
		var output    = new PrintWriter( out );
		var inReader  = new InputStreamReader( socket.getInputStream(), 'utf-8' );
		var bufReader = new BufferedReader( inReader );
		
		var lines = readLines( bufReader );
		
		if ( lines.length > 0 ) {
			var header = lines[ 0 ].split( /\b\s+/ );

			if ( header[ 0 ] === 'GET' ) {
				var URI  = header[ 1 ].split( /\?/ );
				var path = './serverpages' + URI[ 0 ];
		
				respond( output, 'HTTP/1.0 404 Not Found', 'text/html', 'TEST' );
			}
		}
		
		output.flush();
		bufReader.close();
		socket.close();
	};

	var respond = function ( output, status, type, body ) {

		sendBytes( output, status + CRLF );
		sendBytes( output, 'Server: Simple Nashorn HTTP Server' + CRLF );
		sendBytes( output, 'Content-type: ${type}' + CRLF );
		sendBytes( output, 'Content-Length: ${body.length}' + CRLF );
		sendBytes( output, CRLF );
		sendBytes( output, body );
	};

	var contentType = function ( path ) {

		if ( path.endsWith( '.htm' )
		||   path.endsWith( '.html' ) ) {

			return 'text/html';

		} else if ( path.endsWith( '.txt' ) ) {
			return 'text/text';

		} else if ( path.endsWith( '.jpg' )
		||   path.endsWith( '.jpeg' )) {

			return 'image/jpeg';

		} else if (path.endsWith( '.gif' )) {
			return 'image/gif';

		} else {
			return 'application/octet-stream';
		}
	};

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

	function sendFile(output, out, path) {
		var file = new FileInputStream(path);

		var type = contentType(path);
		sendBytes(output, "HTTP/1.0 200 OK" + CRLF);
		sendBytes(output, "Server: Simple Nashorn HTTP Server" + CRLF);
		sendBytes(output, "Content-type: ${contentType(path)}" + CRLF);
		sendBytes(output, "Content-Length: ${file.available()}" + CRLF);
		sendBytes(output, CRLF);
		output.flush();
		
		var buffer = new ByteArray(1024);
		var bytes = 0;
		
		while ((bytes = file.read(buffer)) != -1) {
			out.write(buffer, 0, bytes);
		}
	}

	var colours = {
		java: "BLUE",
		js: "RED", 
		css: "GREEN",
		html: "ORANGE"
	};

	function colorize(file) {
		var suffix = file.substr(file.lastIndexOf(".") + 1);
		var colour = colours[suffix];
		if (colour) {
			return "<FONT COLOR='${colour}'>${file}</FONT>";
		}
		return file;
	}
} );

x.start();

MC.command( '/http', function () {

	serverSocket.close()
	x.stop();
} );