// Location对象
Location = function Location(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(Location, "Location");

// location对象
location = {}
Object.setPrototypeOf(location, Location.prototype);
FaustVM.toolsFunc.defineProperty(location, "valueOf", {configurable:false, enumerable:false, writable:false, value:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "valueOf", arguments)}});
FaustVM.toolsFunc.defineProperty(location, "ancestorOrigins", {configurable:false, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "ancestorOrigins_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(location, "href", {configurable:false, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "href_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "href_set", arguments)}});
FaustVM.toolsFunc.defineProperty(location, "origin", {configurable:false, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "origin_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(location, "protocol", {configurable:false, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "protocol_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "protocol_set", arguments)}});
FaustVM.toolsFunc.defineProperty(location, "host", {configurable:false, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "host_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "host_set", arguments)}});
FaustVM.toolsFunc.defineProperty(location, "hostname", {configurable:false, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "hostname_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "hostname_set", arguments)}});
FaustVM.toolsFunc.defineProperty(location, "port", {configurable:false, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "port_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "port_set", arguments)}});
FaustVM.toolsFunc.defineProperty(location, "pathname", {configurable:false, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "pathname_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "pathname_set", arguments)}});
FaustVM.toolsFunc.defineProperty(location, "search", {configurable:false, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "search_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "search_set", arguments)}});
FaustVM.toolsFunc.defineProperty(location, "hash", {configurable:false, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "hash_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "hash_set", arguments)}});
FaustVM.toolsFunc.defineProperty(location, "assign", {configurable:false, enumerable:true, writable:false, value:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "assign", arguments)}});
FaustVM.toolsFunc.defineProperty(location, "reload", {configurable:false, enumerable:true, writable:false, value:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "reload", arguments)}});
FaustVM.toolsFunc.defineProperty(location, "replace", {configurable:false, enumerable:true, writable:false, value:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "replace", arguments)}});
FaustVM.toolsFunc.defineProperty(location, "toString", {configurable:false, enumerable:true, writable:false, value:function (){return FaustVM.toolsFunc.dispatch(this, location, "location", "toString", arguments)}});
