#[macro_use]
extern crate neon;

use neon::vm::{Call, JsResult, Module};
use neon::js::JsInteger;

fn fibonacci(n: i32) -> i32 {
    return match n {
        1 | 2 => 1,
        n => fibonacci(n - 1) + fibonacci(n - 2)
    }
}

fn method(call: Call) -> JsResult<JsInteger> {
    let scope = call.scope;
    let x = try!(try!(call.arguments.require(scope, 0)).check::<JsInteger>()).value();
    Ok(JsInteger::new(scope, fibonacci(x as i32)))
}

register_module!(m, {
    m.export("fibonacci", method)
});
