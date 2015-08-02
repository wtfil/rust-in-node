var ffi = require('ffi');

var lib = ffi.Library('rust/target/release/libembed', {
	with_callback: ['int', []],
	fibonacci: ['int', ['int']]
});

function withCallback(cb) {
	lib.with_callback.async(cb);
}

module.exports = {
	withCallback: withCallback,
	fibonacci: lib.fibonacci
};
