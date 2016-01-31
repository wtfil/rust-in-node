{
	"targets": [{
		"target_name": "addon",
		"sources": ["addon.cc" ],
        'include_dirs': [
          '.',
        ],
		"conditions": [
			['OS=="linux"', {
				"libraries": [
					"<(module_root_dir)/../../rust/target/release/libembed.so"
				]
			}],
			['OS=="mac"', {
				"libraries": [
					"../../../rust/target/release/libembed.dylib"
				]
			}],
			['OS=="win"', {
				"libraries": [
					"../../../rust/target/release/embed.dll.lib"
				]
			}]
		]
	}]
}
