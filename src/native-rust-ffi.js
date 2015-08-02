var ffi = require('ffi');

module.exports = ffi.Library('rust/target/release/libembed', {
	fibonacci: ['int', ['int']]
});
