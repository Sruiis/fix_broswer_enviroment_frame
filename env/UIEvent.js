// UIEvent对象
UIEvent = function UIEvent(){return FaustVM.toolsFunc.throwError("TypeError", "Failed to construct 'UIEvent': 1 argument required, but only 0 present.")}
FaustVM.toolsFunc.safeProto(UIEvent, "UIEvent");
Object.setPrototypeOf(UIEvent.prototype, Event.prototype);
FaustVM.toolsFunc.defineProperty(UIEvent.prototype, "view", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, UIEvent.prototype, "UIEvent", "view_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(UIEvent.prototype, "detail", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, UIEvent.prototype, "UIEvent", "detail_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(UIEvent.prototype, "sourceCapabilities", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, UIEvent.prototype, "UIEvent", "sourceCapabilities_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(UIEvent.prototype, "which", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, UIEvent.prototype, "UIEvent", "which_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(UIEvent.prototype, "initUIEvent", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, UIEvent.prototype, "UIEvent", "initUIEvent", arguments)}});
