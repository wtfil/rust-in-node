use std::thread;

#[no_mangle]
pub extern fn with_callback() -> i32 {
    thread::sleep_ms(2000u32);
    return 1i32;
}

#[no_mangle]
pub extern fn fibonacci(n: i32) -> i32 {
    return match n {
        1 | 2 => 1,
        n => fibonacci(n - 1) + fibonacci(n - 2)
    }
}
