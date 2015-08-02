function fibonacci(n) {
	return n < 2 ?
		1 : (fibonacci(n - 1) + fibonacci(n - 2));
}

module.exports = {
	fibonacci: fibonacci
};
