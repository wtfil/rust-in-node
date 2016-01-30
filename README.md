# rust-in-node
This is an comparison of different methods of calling `Rust` code from `Node` with benchmarks.
You should have [`node@4.x.x`](https://nodejs.org/download/) and [`rust@1.1.0`](http://www.rust-lang.org/)+ installed and [`node-gyp`](https://github.com/TooTallNate/node-gyp/) configured.

## Methods
There are few different ways to call rust from node. All of them are besed on `FFI` ([Foreign Function Interface](https://doc.rust-lang.org/book/ffi.html))

Minimal steps to crete dynamic library with rust

    cargo new embed
    cd embed
    edit src/lib.rs

```rust
#[no_mangle]
pub extern fn fibonacci(n: i32) -> i32 {
    return match n {
        1 | 2 => 1,
        n => fibonacci(n - 1) + fibonacci(n - 2)
    }
}
```

    edit Cargo.toml
add to bottom
```toml
[lib]
name = "embed"
crate-type = ["dylib"]
```

Then you can build dynamic library

    cargo build --release
    ls target/release
You can find `libembed.dylib` file on mac (or different of others architectures)

### Direct ffi call
You can call any dynamic library with [`node-ffi`](https://github.com/node-ffi/node-ffi) module using pure javascript only.

```js
var ffi = require('ffi');

var lib = ffi.Library('rust/target/release/libembed', {
	fibonacci: ['int', ['int']]
});

lib.fibonacci(10) // 89
```
NOTE: path could be different

### Call dynamic library via c++ addon
This is most complicate way because you have to write `c++` a bit. You can read more about native modules [`here`](https://nodejs.org/api/addons.html)

    mkdir cpp-ffi
    cd cpp-ffi
    edit addon.cc

```c++
#include <node.h>

using namespace v8;
// here we define the fibonacci function from external library (rust dynamic library in our case)
extern int32_t fibonacci(int32_t input);


void Method(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope(isolate);
	int value = args[0]->NumberValue();
	args.GetReturnValue().Set(Number::New(isolate, fibonacci(value)));
}

void init(Handle<Object> exports) {
	NODE_SET_METHOD(exports, "fibonacci", Method);
}

NODE_MODULE(addon, init)
```

    edit binding.gyp

```
{
	"targets": [{
		"target_name": "addon",
		"sources": ["addon.cc" ],
		"libraries": [
			"../../embed/target/release/libembed.dylib"
		]
	}]
}
```
NOTE: path could be different

    edit index.js

```js
module.exports = require('./build/Release/addon');
```

Then you can build module

    node-gyp configure build

## Install
    git clone git@github.com:wtfil/rust-in-node.git
    cd rust-in-node
    npm install
    npm run build

## Benchmark
    node benchmark

## Results
### MacOS
```
vanilla.fibonacci(10)       x 950,929 ops/sec ±1.13% (91 runs sampled)
nativeRustFFI.fibonacci(10) x 32,528 ops/sec ±2.11% (83 runs sampled)
nativeCpp.fibonacci(10)     x 1,820,482 ops/sec ±1.01% (93 runs sampled)
nativeCppFFI.fibonacci(10)  x 1,825,865 ops/sec ±1.31% (89 runs sampled)
```

As you can see the direct ffi call is to slow to have deal with it, but ffi + `C++` wrapper as fast as a native `C++` module, so `Rust` is good candidate for native modules for `Nodejs`

### Windows
(i5-4200U, win 10)
```
vanilla.fibonacci(10)       x 1,377,844 ops/sec ±0.16% (97 runs sampled)
nativeRustFFI.fibonacci(10) x 339,064 ops/sec ±0.28% (102 runs sampled)
nativeCpp.fibonacci(10)     x 2,698,431 ops/sec ±0.22% (100 runs sampled)
nativeCppFFI.fibonacci(10)  x 4,479,237 ops/sec ±0.32% (98 runs sampled)
```

For some reason performance of a Rust lib connected to a C++ NodeJS extension via the C ABI is drastically faster. It is quite possibly that VC++ 2015 compiler is suboptimal.

## Building on windows
Building on windows might be a challenging task, because `node-gyp` makes everyone
unhappy on windows.

If everything is configured properly `npm run build` should just work.

However it is likely to be broken. Try these steps if it is:

1. First ensure that you followed all windows installation instruction from README on https://github.com/nodejs/node-gyp
2. Ensure that you using the same target for both Rust and C++. Rust should be
compiled with MSVC target and target platform should be the same (ie i686/win32)
3. Newer versions of [`Cargo`](https://github.com/rust-lang/cargo) produce `.dll.lib`
files and older versions produce simply `.lib`. After building rust code please ensure
that win embed lib name in `src\native-cpp-ffi\binding.gyp` match file names in `rust\target\release`.
4. If you building only rust and native-cpp-ffi then you need to copy all
libs compiled by cargo into directory of node addon. In this parcitular case:
copy `rust/target/release/embed*` to `src/native-cpp-ffi/build/Release`


## Plans
Test `Rust` module with multithreading. It could give even better result.
Feel free to add any other tests :)
