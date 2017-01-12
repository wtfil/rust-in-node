# rust-in-node
This is a comparison of different methods of calling `Rust` code from `Node` with benchmarks.
You should have [`node@4.x.x`](https://nodejs.org/download/) and [`rust@1.1.0`](http://www.rust-lang.org/)+ installed and [`node-gyp`](https://github.com/TooTallNate/node-gyp/) configured.

## Methods
There are a few different ways to call `Rust` from `Node`. All of them are based on `FFI` ([Foreign Function Interface](https://doc.rust-lang.org/book/ffi.html)).

### Minimal steps to create a dynamic library with `Rust`

    cargo new embed
    cd embed
    edit src/lib.rs

```rust
#[no_mangle]
pub extern fn fibonacci(n: i32) -> i32 {
    return match n {
        0 => 0,
        1 => 1,
        n => fibonacci(n - 1) + fibonacci(n - 2)
    }
}
```

    edit Cargo.toml
Add to bottom:
```toml
[lib]
name = "embed"
crate-type = ["dylib"]
```

Then you can build the dynamic library:

    cargo build --release
    ls target/release
You can now find a `libembed.dylib` file on macOS (different for other architectures).

### Direct ffi call
You can call any dynamic library with [`node-ffi`](https://github.com/node-ffi/node-ffi) module using only `JavaScript`.

```js
var ffi = require('ffi');

var lib = ffi.Library('rust/target/release/libembed', {
	fibonacci: ['int', ['int']]
});

lib.fibonacci(10) // 89
```
NOTE: path could be different

### Call dynamic library via c++ addon
This is the most complicated way because you have to write a bit of `C++`. You can read more about native modules [`here`](https://nodejs.org/api/addons.html).

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

Then you can build the module:

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
(i5-4258U, EI Capitan 10.11.5)
```
vanilla.fibonacci(10)        x 1,619,893 ops/sec ±2.52% (88 runs sampled)
nativeRustFFI.fibonacci(10)  x 221,780 ops/sec ±7.69% (78 runs sampled)
nativeCpp.fibonacci(10)      x 3,261,136 ops/sec ±4.91% (81 runs sampled)
nativeCppFFI.fibonacci(10)   x 3,936,481 ops/sec ±5.73% (84 runs sampled)
nativeRustNeon.fibonacci(10) x 2,337,627 ops/sec ±4.08% (80 runs sampled)
```

As you can see the direct ffi call is too slow to have deal with it, but ffi + `C++` wrapper is as fast as a native `C++` module, so `Rust` is a good candidate for native modules for `Node.js`.

### Windows
(i5-4200U, Win 10)
```
vanilla.fibonacci(10)       x 1,377,844 ops/sec ±0.16% (97 runs sampled)
nativeRustFFI.fibonacci(10) x 339,064 ops/sec ±0.28% (102 runs sampled)
nativeCpp.fibonacci(10)     x 2,698,431 ops/sec ±0.22% (100 runs sampled)
nativeCppFFI.fibonacci(10)  x 4,479,237 ops/sec ±0.32% (98 runs sampled)
```

### Linux
(same i5-4200U, Ubuntu 15)
```
vanilla.fibonacci(10)       x 2,108,353 ops/sec ±0.49% (98 runs sampled)
nativeRustFFI.fibonacci(10) x 334,195 ops/sec ±0.42% (93 runs sampled)
nativeCpp.fibonacci(10)     x 4,646,598 ops/sec ±0.40% (100 runs sampled)
nativeCppFFI.fibonacci(10)  x 5,235,762 ops/sec ±0.70% (100 runs sampled)
```

### Linux
(Intel® Xeon(R) CPU E5630 @ 2.53GHz × 8 ubuntu 16.04)

```
vanilla.fibonacci(10)        x 1,481,437 ops/sec ±0.93% (100 runs sampled)
nativeRustFFI.fibonacci(10)  x 170,863 ops/sec ±0.46% (96 runs sampled)
nativeCpp.fibonacci(10)      x 2,500,092 ops/sec ±0.22% (103 runs sampled)
nativeCppFFI.fibonacci(10)   x 2,451,105 ops/sec ±0.93% (96 runs sampled)
nativeRustNeon.fibonacci(10) x 2,405,373 ops/sec ±0.17% (97 runs sampled)
```

For some reason on Windows performance of a `Rust` lib connected to a `C++` `Node.js` extension via the C ABI is drastically faster. It is quite possibly that VC++ 2015 compiler is suboptimal. `Rust` + `C++` is also faster on Ubuntu.

## Building on windows
Building on Windows might be a challenging task, because `node-gyp` makes everyone
unhappy on Windows.

If everything is configured properly `npm run build` should just work.

However, it is likely to be broken. In that case try these steps:

1. First ensure that you followed all Windows installation instruction from README on https://github.com/nodejs/node-gyp
2. Ensure that you using the same target for both `Rust` and `C++`. `Rust` should be
compiled with MSVC target and target platform should be the same (ie i686/win32)
3. Newer versions of [`Cargo`](https://github.com/rust-lang/cargo) produce `.dll.lib`
files and older versions produce simply `.lib`. After building rust code please ensure
that win embed lib name in `src\native-cpp-ffi\binding.gyp` matches file names in `rust\target\release`.
4. If you are building only `Rust` and `native-cpp-ffi` then you need to copy all
libs compiled by Cargo into the directory of the Node addon. In this particular case:
copy `rust/target/release/embed*` to `src/native-cpp-ffi/build/Release`


## Plans
Test `Rust` module with multi-threading. It could produce even better results.
Feel free to add any other tests :)
