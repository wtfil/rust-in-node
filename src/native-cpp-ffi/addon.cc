#include <node.h>
#include <addon.h>

using namespace v8;

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
