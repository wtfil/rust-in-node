use std::thread;

#[no_mangle]
pub extern fn with_callback(cb: extern fn(i32)) {
    cb(1i32);
    /*
    let delay: u32 = 10000;
    thread::sleep_ms(delay);
    let handles: Vec<_> = (0..10).map(|_| {
        thread::spawn(|| {
            let mut _x = 0;
            for _ in (0..5_000_000) {
                _x += 1
            }
            return _x;
        })
    }).collect();

    for h in handles {
        h.join().ok().expect("Could not join a thread!");
    }*/
}

#[no_mangle]
pub extern fn fibonacci() -> u32 {
    let x:u32 = 5;
    return x;
}
