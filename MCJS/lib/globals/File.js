'use strict';


/**
 * @namespace
 */

var File = function () {};


/**
 * Allows you to read and return the value of a file.
 * @implements File
 * @param {String} path - Specify a target text file to read.
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
 * Allows you to write data to a file.
 * @implements File
 * @param {String} path - Specify a target file path.
 * @param {String} data - The data to be written to the file.
 */

File.prototype.write = function ( filePath, data ) {

	var FileWriter = Java.type( 'java.io.FileWriter' );

	var file = new FileWriter( PATH + filePath );

	file.write( data );
	file.close();
};


/**
 * Allows you to append data to a value.
 * @implements File
 * @param {String} path - Specify a target file path.
 * @param {String} data - The data to be appended to the file.
 */

File.prototype.append = function ( filePath, data ) {

	var FileWriter = Java.type( 'java.io.FileWriter' );

	var file = new FileWriter( PATH + filePath, true );

	file.write( data );
	file.close();
};


/**
 * Allows you to delete a file at the specified path.
 * @implements File
 * @param {String} path - Specify a target file path for deletion.
 */

File.prototype.delete = function ( filePath ) {

	new java.io.File( PATH + filePath ).delete();
};


module.exports = new File();
