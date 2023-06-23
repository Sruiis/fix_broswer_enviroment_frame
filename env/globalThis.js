// window对象

// 删除浏览器中不存在的对象
delete global;
delete Buffer;
delete process;
delete GLOBAL;
delete root;
delete VMError;
delete globalThis[Symbol.toStringTag];
delete WindowProperties;

window = globalThis;

Object.setPrototypeOf(window, Window.prototype);

// atob方法实现
FaustVM.toolsFunc.defineProperty(window, "atob", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function atob(str) {
        return FaustVM.toolsFunc.base64.base64decode(str);
    }
})
// btoa方法实现
FaustVM.toolsFunc.defineProperty(window, "btoa", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function btoa(str) {
        return FaustVM.toolsFunc.base64.base64encode(str);
    }
})
FaustVM.toolsFunc.defineProperty(window, "name", {
    configurable: true,
    enumerable: true,
    get: function () { },
    set: function () { }
})

FaustVM.toolsFunc.defineProperty(window, "name", {
    configurable: true,
    enumerable: true,
    get: function () {
        return FaustVM.toolsFunc.dispatch(this, window, "window", "name_get", arguments, '')
    },
    set: function () {
        return FaustVM.toolsFunc.dispatch(this, window, "window", "name_set", arguments)
    }
});


Object.defineProperty(window, 'location', {configurable:false});

FaustVM.toolsFunc.defineProperty(window, "top", {configurable:false, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, window, "window", "top_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(window, "self", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, window, "window", "self_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, window, "window", "self_set", arguments)}});
FaustVM.toolsFunc.defineProperty(window, "parent", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, window, "window", "parent_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, window, "window", "parent_set", arguments)}});
eval = FaustVM.toolsFunc.hook(eval, undefined, false, function (){},function (){});

FaustVM.toolsFunc.defineProperty(window, "setTimeout", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, window, "window", "setTimeout", arguments)}});
FaustVM.toolsFunc.defineProperty(window, "clearTimeout", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, window, "window", "clearTimeout", arguments)}});
