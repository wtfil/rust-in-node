{
	"targets": [{
		"target_name": "addon",
		"sources": ["addon.cc" ],
		"conditions": [
			['OS=="mac"', {
				"libraries": [
					"../../../rust/target/release/libembed.dylib"
				]
			}],
			['OS=="win"', {
				"libraries": [
					"../../../rust/target/release/libembed.dll"
				]
			}]
		]
	}]
}
