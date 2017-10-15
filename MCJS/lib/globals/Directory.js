'use strict';

/**
 * @namespace
 * @param {String} fileInfo - This is set the require function on file load.
 */

var Directory = new Class( function ( fileInfo ) {

	this.resolvePath = function ( rawDirPath ) {

		var dirPath = rawDirPath || '';

		var isAbsolute = ( new java.io.File( dirPath ) ).isAbsolute();

		var path = dirPath;

		if ( !isAbsolute ) {
			path = java.nio.file.Paths.get( fileInfo.__dirname, dirPath.replace( /^\.\//, '' ) ).toString();
		}

		return path;
	};
} );

/**
 * Allows you to create a directory.
 * @implements Directory
 * @param {String} path - Specify a target directory path.
 * @example
 * Directory.create( './new Folder' );
 */

Directory.prototype.create = function ( dirPath ) {

	var path = this.resolvePath( dirPath );

	( new java.io.File( path ) ).mkdir();
};


/**
 * Allows you to read a directories contents.
 * @implements Directory
 * @param {String} path - Specify a target directory path.
 * @return {Array} paths
 * @example
 * var files = Directory.list( './new Folder' );
 *
 * for ( var i in files ) {
 * 	console.log( files[ i ] );
 * }
 */

Directory.prototype.list = function ( dirPath ) {

	var files = [];

	var path     = this.resolvePath( dirPath );
	var rawFiles = new java.io.File( path ).listFiles();

	for ( var i in rawFiles ) {
		files.push( rawFiles[ i ].toString().replace( /\\/g, '/' ) );
	}

	return files;
};


/**
 * Allows you to delete a directory.
 * @implements Directory
 * @param {String} path - Specify a target directory path.
 * @example
 * Directory.delete( './new Folder' );
 */

Directory.prototype.delete = function ( dirPath ) {

	var path = this.resolvePath( dirPath );

	var dir = new java.io.File( path );

	if ( dir.isDirectory() ) {

		var files = this.list( path );

		for ( var i in files ) {
			var file = new java.io.File( files[ i ] );

			if ( file.isDirectory() ) {
				this.delete( file.toString() );

			} else {
				file.delete();
			}
		}

		dir.delete();
	}
};


/**
 * Allows to check if a directory at the specified path exists or not.
 * @implements File
 * @return {Boolean}
 * @param {String} path - Specify a target directory path for checking.
 * @example
 * var dirExists = Directory.exists( './myFolder' );
 */

Directory.prototype.exists = function ( dirPath ) {

	var path = this.resolvePath( dirPath );

	var dir = new java.io.File( path );

	return dir.isDirectory();
};



module.exports = Directory;
