'use strict';

var File = function () {};

File.prototype.read = function ( file ) {

	var BufferedReader = java.io.BufferedReader;
	var FileReader     = java.io.FileReader;

	var contents = [];
	var line = undefined;

	var bufferReader = new BufferedReader( new FileReader( PATH + file ) );

	while ( ( line = bufferReader.readLine() ) !== null ) {
	    contents.push( line );
	}

	bufferReader.close();

	return contents.join( '\n' );
};

module.exports = new File();