'use strict';


/**
 * @namespace
 */

var File = new Class( function ( file ) {

	this.private.fileInfo = file;
} );


File.prototype.private.resolvePath = function ( rawFilePath ) {

	var filePath = rawFilePath || '';

	var isAbsolute = ( new java.io.File( filePath ) ).isAbsolute();

	var path = filePath;

	if ( !isAbsolute ) {
		path = java.nio.file.Paths.get( this.private.fileInfo.__dirname.replace( /^\.\//, '' ), filePath ).toString();
	}

	return path;
};


/**
 * Allows you to read and return the value of a file.
 * @implements File
 * @param {String} path - Specify a target text file to read.
 * @return {String}
 * @example
 * var data = File.read( './text.txt' );
 */

File.prototype.read = function ( filePath ) {

	var path = this.private.resolvePath( filePath );

	var contents = [];
	var line     = undefined;

	var file = new java.io.File( path );

	if ( file.exists() ) {

		var fileReader = new java.io.FileReader( path );

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
 * @param {String} [data] - The data to be written to the file.
 * @example
 * File.write( './text.txt' );
 * // or
 * File.write( './text.txt', 'yay' );
 */

File.prototype.write = function ( filePath, data ) {

	var path = this.private.resolvePath( filePath );

	var FileWriter = Java.type( 'java.io.FileWriter' );

	var file = new FileWriter( path );

	file.write( data || '' );
	file.close();
};


/**
 * Alias for File.write().
 * @implements File
 * @param {String} path - Specify a target file path.
 * @param {String} [data] - The data to be written to the file.
 * @example
 * File.create( './text.txt' );
 * // or
 * File.create( './text.txt', 'yay' );
 */

File.prototype.create = function ( filePath, data ) {

	this.write( filePath, data );
};


/**
 * Allows you to append data to a value.
 * @implements File
 * @param {String} path - Specify a target file path.
 * @param {String} data - The data to be appended to the file.
 * @example
 * File.append( './text.txt', 'yay' );
 */

File.prototype.append = function ( filePath, data ) {

	var path = this.private.resolvePath( filePath );

	var FileWriter = Java.type( 'java.io.FileWriter' );

	var file = new FileWriter( path, true );

	file.write( data );
	file.close();
};


/**
 * Allows you to delete a file at the specified path.
 * @implements File
 * @param {String} path - Specify a target file path for deletion.
 * @example
 * File.delete( './text.txt' );
 */

File.prototype.delete = function ( filePath ) {

	var path = this.private.resolvePath( filePath );

	new java.io.File( path ).delete();
};


module.exports = File;
