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
var nativeRustNeon = require('./src/native-rust-neon');
suite
	.add('vanilla.fibonacci(10)\t\t', function () {
		vanilla.fibonacci(10);
	})
	.add('nativeRustFFI.fibonacci(10)\t', function () {
		nativeRustFFI.fibonacci(10);
	})
	.add('nativeCpp.fibonacci(10)\t\t', function () {
		nativeCpp.fibonacci(10);
	})
	.add('nativeCppFFI.fibonacci(10)\t', function () {
		nativeCppFFI.fibonacci(10);
	})
	.add('nativeRustNeon.fibonacci(10)\t', function () {
		nativeRustNeon.fibonacci(10);
	})
	.on('complete', function () {
		this.forEach(item => console.log(item.toString()));
	})
	.run();

