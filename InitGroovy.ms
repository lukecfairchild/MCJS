
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

groovy( read( 'CHJavascript.groovy' ), array( 'commandHelperEnvironment' : get_script_environment(), 'javascriptFile' : read( 'Global.js' ) ) );
