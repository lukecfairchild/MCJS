
console.log( File.read( './test/b.js' ) );

console.log( Directory.list( './test' ) );

Directory.create( './test2' );
File.create( './test2/yay.txt' );

setTimeout( function () {

	Directory.delete( './test2' );
}, 5000 );