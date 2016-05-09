#include <node.h>
#include "fibonacci.cc"
#include "matrixMultiplication.cc"

using namespace v8;

void MethodFibonacci(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);
	int value = args[0]->NumberValue();
	args.GetReturnValue().Set(Number::New(isolate, fibonacci(value)));
}

void MethodMatrixMultiplication(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = args.GetIsolate();
	Handle<Array> a = Handle<Array>::Cast(args[0]);
	Handle<Array> b = Handle<Array>::Cast(args[1]);
	Local<Array> c = matrixMult(isolate, a, b);
	args.GetReturnValue().Set(c);
}

void init(Handle<Object> exports) {
	NODE_SET_METHOD(exports, "fibonacci", MethodFibonacci);
	NODE_SET_METHOD(exports, "matrixMultiplication", MethodMatrixMultiplication);
}

NODE_MODULE(addon, init)
