var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;
var native = require('./src/native');
var vanilla = require('./src/vanilla');

suite
	.add('native.fibonacci(10)', function () {
		native.fibonacci(10);
	})
	.add('vanilla.fibonacci(10)', function () {
		vanilla.fibonacci(10);
	})
	.on('complete', function () {
		console.log(this[0].toString());
		console.log(this[1].toString());
	})
	.run();
