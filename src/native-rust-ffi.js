var ffi = require('ffi');
var process = require('process')

var isWin = /^win/.test(process.platform);

module.exports = ffi.Library('rust/target/release/'+(!isWin?'lib':'')+'embed', {
	fibonacci: ['int', ['int']]
});
