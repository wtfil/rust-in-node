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
