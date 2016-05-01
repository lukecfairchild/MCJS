
javax.script.ScriptEngineManager scriptManager = new javax.script.ScriptEngineManager();
javax.script.ScriptEngine        jsEngine      = scriptManager.getEngineByName( 'javascript' );

jsEngine.eval( 'var com = {}; com.laytonsmith = {}; com.laytonsmith.core = {}; com.laytonsmith.core.functions ={}' );
jsEngine.put( 'TEMP', com.laytonsmith.core.functions.Scheduling );
jsEngine.eval( 'com.laytonsmith.core.functions.Scheduling = TEMP.static; TEMP = undefined' );

jsEngine.put( 'TEMP', com.laytonsmith.core.Globals );
jsEngine.eval( 'com.laytonsmith.core.Globals = TEMP.static; TEMP = undefined' );

jsEngine.put( 'TEMP', com.laytonsmith.core.extensions.ExtensionManager );
jsEngine.eval( 'com.laytonsmith.core.extensions ={}' )
jsEngine.eval( 'com.laytonsmith.core.extensions.ExtensionManager = TEMP.static; TEMP = undefined' );

jsEngine.put( 'TEMP', com.laytonsmith.core.constructs.Target );
jsEngine.eval( 'var Target = TEMP.static; TEMP = undefined;' );

jsEngine.put( 'TEMP', com.laytonsmith.core.constructs.CString );
jsEngine.eval( 'var CString = TEMP.static; TEMP = undefined;' );

jsEngine.put( 'TEMP', com.laytonsmith.core.constructs.CInt );
jsEngine.eval( 'var CInt = TEMP.static; TEMP = undefined;' );


/**
 * Globally declare the variable 'global'.
 */

jsEngine.eval( 'var global = {};' );


/**
 * Figure out the current Directory.
 */

jsEngine.put( 'commandHelperEnvironment', _Environment );

_serverDir = java.lang.System.getProperty( 'user.dir' ) + '\\';
_pluginDir = org.bukkit.Bukkit.getPluginManager().getPlugin( 'CommandHelper' ).getDataFolder();
_targetDir = '\\LocalPackages\\MCJS\\js';

_PATH = _serverDir + _pluginDir + _targetDir;

jsEngine.put( 'PATH', _PATH );



/**
 * Read in Global.js and eval it.
 */

/*
bufferReader = new java.io.BufferedReader( new java.io.FileReader( _PATH + '/CH.js' ) );

while ( ( line = bufferReader.readLine() ) !== null ) {
	java.lang.System.out.println( line );
}

bufferReader.close();
*/
jsEngine.eval( _Javascript );
