/*
struct mat4 {
	float dat[4][4];
};

struct mat4 mult4(const struct mat4 a, const struct mat4 b) {
	int i, j, k;
	struct mat4 out = {
		dat: {
			{0., 0., 0., 0.},
			{0., 0., 0., 0.},
			{0., 0., 0., 0.},
			{0., 0., 0., 0.}
		}
	};

	for (i=0; i<4; i++) {
	    for (j=0; j<4; j++) {
	        for (k=0; k<4; k++) {
	            out.dat[i][j] += a.dat[i][k] * b.dat[k][j];
	        }
	    }
	}

	return out;
}
*/

/*
class matrixLine {
	public:
		vector<float> float;
}
class matrix {
	public:
		vector<matrixLine> matrixLine;
}
*/

#include <vector>
using namespace v8;
using namespace std;
typedef vector<vector<float>> matrix;

matrix toVector(const Handle<Array> raw) {
	int size = raw->Length();
	int i, j;
	vector<vector<float>> a;

	for (i = 0; i < size; i ++) {
		vector<float> row;
		Handle<Array> line = Handle<Array>::Cast(raw->Get(i));
		for (j = 0; j < size; j ++) {
			row.push_back(line->Get(j)->NumberValue());
		}
		a.push_back(row);
	}
	return a;
}

Local<Array> matrixMult(Isolate * isolate, const Handle<Array> aRaw,const Handle<Array> bRaw) {
	int size = aRaw->Length();
	int i, j, k;

	matrix a = toVector(aRaw);
	matrix b = toVector(bRaw);
	Local<Array> c = Array::New(isolate, size);

	for(i = 0; i < size; i ++) {
		Local<Array> cLine = Array::New(isolate, size);
		for (j = 0; j < size; j ++) {
			float val = 0;
			for (k = 0; k < size; k ++) {
				val += a[i][k] * b[k][j];
			}
			cLine->Set(j, Number::New(isolate, val));
		}
		c->Set(i, cLine);
	}
	return c;
}
