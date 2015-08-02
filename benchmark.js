var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;
var native = require('./src/native');
var vanilla = require('./src/vanilla');
var addon = require('./src/addon');

suite
	.add('native.fibonacci(10)', function () {
		native.fibonacci(10);
	})
	.add('vanilla.fibonacci(10)', function () {
		vanilla.fibonacci(10);
	})
	.add('addon.fibonacci(10)', function () {
		addon.fibonacci(10);
	})
	.on('complete', function () {
		console.log(this[0].toString());
		console.log(this[1].toString());
		console.log(this[2].toString());
	})
	.run();
