var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;
var nativeRustFFI = require('./src/native-rust-ffi');
/**
 * In case if you need only C++ rust native call
 * you need to copy all libs compiled by cargo
 * into directory of node addon.
 * In this parcitular case:
 * copy rust/target/release/embed* to src/native-cpp-ffi/build/Release
 *
 * In this example it works without copying this files because ffi
 * has included native-rust libs in the line of code above
 */
var nativeCppFFI = require('./src/native-cpp-ffi');
var nativeCpp = require('./src/native-cpp');
var vanilla = require('./src/vanilla');

suite
	.add('vanilla.fibonacci(10)      ', function () {
		vanilla.fibonacci(10);
	})
	.add('nativeRustFFI.fibonacci(10)', function () {
		nativeRustFFI.fibonacci(10);
	})
	.add('nativeCpp.fibonacci(10)    ', function () {
		nativeCpp.fibonacci(10);
	})
	.add('nativeCppFFI.fibonacci(10) ', function () {
		nativeCppFFI.fibonacci(10);
	})
	.on('complete', function () {
		console.log(this[0].toString());
		console.log(this[1].toString());
		console.log(this[2].toString());
		console.log(this[3].toString());
	})
	.run();
