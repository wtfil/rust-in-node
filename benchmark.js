var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;
var nativeRustFFI = require('./src/native-rust-ffi');
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
