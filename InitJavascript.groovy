
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
 * Initialize needed variables passed from commandhelper.
 */

jsEngine.put( 'commandHelperEnvironment', _Environment );
jsEngine.put( 'PATH', _ScriptPath );


/**
 * Run the main javascript file passed into groovy.
 */

jsEngine.eval( _Javascript );
