function fibonacci(n) {
	return n <= 2 ?
		1 : (fibonacci(n - 1) + fibonacci(n - 2));
}

function matrixMultiplication (a, b) {
	var size = a.length;
	var i, j, k;
	var c = new Array(size).fill().map(item => new Array(size).fill(0));
	for (i = 0; i < size; i ++) {
		for (j = 0; j < size; j ++) {
			for (k = 0; k < size; k ++) {
				c[i][j] += a[i][k] * b[k][j];
			}
		}
	}
	return c;
}

module.exports = {
	fibonacci, matrixMultiplication
};
