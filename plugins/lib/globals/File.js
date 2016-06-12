'use strict';


/**
 * @class
 */

var File = function () {};


/**
 * @implements File
 * @return {String}
 */

File.prototype.read = function ( filePath ) {

	var path = java.nio.file.Paths.get( PATH, filePath ).toString();

	var contents = [];
	var line     = undefined;

	var file = new java.io.File( PATH + filePath );

	if ( file.exists() ) {

		var fileReader = new java.io.FileReader( PATH + filePath );

		var bufferReader = new java.io.BufferedReader( fileReader );

		while ( ( line = bufferReader.readLine() ) !== null ) {
			contents.push( line );
		}

		bufferReader.close();
		fileReader.close();

		return contents.join( '\n' );

	} else {
		console.log( '[ERROR]'.orange() + ' File not found:\n' + path + ':' + '\n' );
	}
};


/**
 * @implements File
 */

File.prototype.write = function ( filePath, data ) {

	var FileWriter = Java.type( 'java.io.FileWriter' );

	var file = new FileWriter( PATH + filePath );

	file.write( data );
	file.close();
};


/**
 * @implements File
 */

File.prototype.append = function ( filePath, data ) {

	var FileWriter = Java.type( 'java.io.FileWriter' );

	var file = new FileWriter( PATH + filePath, true );

	file.write( data );
	file.close();
};


File.prototype.delete = function ( filePath ) {

	new java.io.File( PATH + filePath ).delete();
};


module.exports = new File();
