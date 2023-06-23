// PluginArray对象
PluginArray = function PluginArray(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(PluginArray, "PluginArray");
FaustVM.toolsFunc.defineProperty(PluginArray.prototype, "length", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, PluginArray.prototype, "PluginArray", "length_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(PluginArray.prototype, "item", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, PluginArray.prototype, "PluginArray", "item", arguments)}});
FaustVM.toolsFunc.defineProperty(PluginArray.prototype, "namedItem", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, PluginArray.prototype, "PluginArray", "namedItem", arguments)}});
FaustVM.toolsFunc.defineProperty(PluginArray.prototype, "refresh", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, PluginArray.prototype, "PluginArray", "refresh", arguments)}});
