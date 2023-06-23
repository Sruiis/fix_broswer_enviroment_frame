// HTMLDocument对象
HTMLDocument = function HTMLDocument(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(HTMLDocument, "HTMLDocument");
Object.setPrototypeOf(HTMLDocument.prototype, Document.prototype);

// document对象
document = {}
Object.setPrototypeOf(document, HTMLDocument.prototype);
FaustVM.toolsFunc.defineProperty(document, "location", {configurable:false, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, document, "document", "location_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, document, "document", "location_set", arguments)}});
