'use strict';

( function ( rootDir, modulePaths, hooks ) {

	var fmt            = java.lang.String.format;
	var File           = java.io.File;
	var FileReader     = java.io.FileReader;
	var BufferedReader = java.io.BufferedReader;
	var _loadedModules = {};

	var readModuleFromDirectory = function ( dir ) {

		// look for a package.json file
		var pkgJsonFile = new File( dir, './package.json' );

		if ( pkgJsonFile.exists() ) {
			var pkg      = scload( pkgJsonFile );
			var mainFile = new File( dir, pkg.main );

			if ( mainFile.exists() ) {
				return mainFile;

			} else {
				return null;
			}

		} else {
			// look for an index.js file
			var indexJsFile = new File( dir, './index.js' );

			if ( indexJsFile.exists() ) {
				return indexJsFile;

			} else { 
				return null;
			}
		}
	};

	var fileExists = function ( file ) {

		if ( file.isDirectory() ) {
			return readModuleFromDirectory( file );

		} else {
			return file;
		}
	};

	var _canonize = function ( file ) { 

		return String( file.canonicalPath.replaceAll( '\\\\', '/' ) ); 
	};

	var resolveModuleToFile = function ( moduleName, parentDir ) {

		var file = new File( moduleName );

		if ( file.exists() ) {
			return fileExists( file );
		}

		if ( moduleName.match( /^[^\.\/]/ ) ) {
			// it's a module named like so ... 'events' , 'net/http'
			var resolvedFile;

			for ( var i in modulePaths ) {
				resolvedFile = new File( modulePaths[ i ] + moduleName );

				if ( resolvedFile.exists() ) {
					return fileExists( resolvedFile );

				} else {
					// try appending a .js to the end
					resolvedFile = new File( modulePaths[ i ] + moduleName + '.js' );

					if ( resolvedFile.exists() ) {
						return resolvedFile;
					}
				}
			}

		} else {
			// it's of the form ./path
			file = new File( parentDir, moduleName );

			if ( file.exists() ) {
				return fileExists( file );

			} else { 
				// try appending a .js to the end
				var pathWithJSExt = file.canonicalPath + '.js';
				file              = new File( parentDir, pathWithJSExt);

				if ( file.exists() ) {
					return file;

				} else {
					file = new File( pathWithJSExt );

					if ( file.exists() ) {
						return file;
					}
				}
			}
		}
		return null;
	};

	/*
	require() function implementation
	*/

	var _requireClosure = function ( parent ) {

		return function( path ) {
			var module = _require( parent, path );
			return module.exports;
		};
	};

	var _require = function ( parentFile, path ) {

		var buffered;
		var moduleInfo;
		var canonizedFilename;

		var file = resolveModuleToFile( path, parentFile );
		var head = '( function( exports, module, require, __filename, __dirname, global ){ ';
		var code = '';
		var tail = '} ).bind( global )';
		var line = null;

		for ( var index in global ) {
			head += 'var ' + index + ' = global.' + index + '; '; 
		}

		if ( !file ) {
			var errMsg = String( fmt(
				"require() failed to find matching file for module '%s' " + 
				"in working directory '%s' "
			, [
				path,
				parentFile.canonicalPath
			] ) );

			if ( !( ( String( path ) ).match( /^\./ ) ) ) {
				errMsg = errMsg + ' and not found in paths ' + JSON.stringify( modulePaths );
			}

			throw errMsg;
		}

		canonizedFilename = _canonize( file );
		
		moduleInfo = _loadedModules[ canonizedFilename ];

		if ( moduleInfo ) {
			return moduleInfo;
		}

		if ( hooks ) {
			hooks.loading( canonizedFilename );
		}

		buffered = new BufferedReader( new FileReader( file ) );

		while ( ( line = buffered.readLine()) !== null ) {
			code += line + '\n';
		}

		buffered.close(); // close the stream so there's no file locks

		moduleInfo = {
			'loaded'  : false,
			'id'      : canonizedFilename,
			'exports' : {},
			'require' : _requireClosure( file.parentFile )
		};

		code = head + code + tail;

		_loadedModules[ canonizedFilename ] = moduleInfo;
		var compiledWrapper = null;

		try {
			compiledWrapper = eval( code );

		} catch ( error ) {
			throw new Error(
				'Error evaluating module ' + path +
				' line #' + error.lineNumber +
				' : ' + error.message, canonizedFilename, error.lineNumber
			);
		}

		var __dirname = '' + file.parentFile.canonicalPath;
		var parameters = [
			moduleInfo.exports, /* exports */
			moduleInfo,         /* module */
			moduleInfo.require, /* require */
			canonizedFilename,  /* __filename */
			__dirname,          /* __dirname */
			global
		];

		try {
			compiledWrapper.apply(
				moduleInfo.exports,  /* this */
				parameters
			);

		} catch ( error ) {
			throw new Error(
				'Error executing module ' + path +
				' line #' + error.lineNumber +
				' : ' + error.message, canonizedFilename, error.lineNumber
			);
		}

		if ( hooks ) { 
			hooks.loaded( canonizedFilename );
		}

		moduleInfo.loaded = true;
		return moduleInfo;
	};

	return _requireClosure( new java.io.File( rootDir ) );
	// last line deliberately has no semicolon!
} );
