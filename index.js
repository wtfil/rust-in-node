var ffi = require('ffi');

var lib = ffi.Library('rust/target/release/libembed', {
	with_callback: ['void', ['pointer']],
	fibonacci: ['int', ['int']]
});

function withCallback(cb) {
	var cbPtr = ffi.Callback('void', ['int'], cb);
	lib.with_callback(cbPtr);
}

console.time('fibonacci');
var a = lib.fibonacci(4)
console.timeEnd('fibonacci');
console.log(a);
