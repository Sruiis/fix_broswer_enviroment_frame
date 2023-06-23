// WindowProperties对象
WindowProperties = function WindowProperties() {

};
// 保护WindowProperties对象
FaustVM.toolsFunc.safeProto(WindowProperties, 'WindowProperties');

// 删除构造方法
delete WindowProperties.prototype.constructor

// 设置WindowProperties原型对象
Object.setPrototypeOf(WindowProperties.prototype, EventTarget.prototype)