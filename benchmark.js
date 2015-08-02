var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;
var nativeRust = require('./src/native-rust');
var nativeCpp = require('./src/native-cpp');
var vanilla = require('./src/vanilla');

suite
	.add('nativeRust.fibonacci(10)', function () {
		nativeRust.fibonacci(10);
	})
	.add('vanilla.fibonacci(10)', function () {
		vanilla.fibonacci(10);
	})
	.add('nativeCpp.fibonacci(10)', function () {
		nativeCpp.fibonacci(10);
	})
	.on('complete', function () {
		console.log(this[0].toString());
		console.log(this[1].toString());
		console.log(this[2].toString());
	})
	.run();
