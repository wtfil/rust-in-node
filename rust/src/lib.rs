#[no_mangle]
pub extern fn fibonacci(n: i32) -> i32 {
    return match n {
        1 | 2 => 1,
        n => fibonacci(n - 1) + fibonacci(n - 2)
    }
}
