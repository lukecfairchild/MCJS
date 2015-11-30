
@eval = closure( @var ) {

	@code      = json_decode( @var )[ 0 ]
	@timeStamp = nano_time();

	eval(
		'@exports = array();'.
		@code. ';'.
		'export( "'. @timeStamp. '", @exports );'
	);

	@returns = import( string( @timeStamp ) );

	export( @timeStamp, null );

	return( json_encode( array( 'value' : @returns ) ) );
};

export( 'lastReload', time() );

groovy( read( 'InitJavascript.groovy' ), array(
	'_Environment' : get_script_environment(),
	'_Javascript'  : read( 'js/Global.js' ),
	'_ScriptPath'  : replace( pwd(), '\\', '/' )
) );
