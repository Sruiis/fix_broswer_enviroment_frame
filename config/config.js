// 全局对象配置
debugger;
FaustVM = {
    "toolsFunc":{},//功能函数相关，插件
    "envFunc":{},// 具体环境实现相关
    "config":{}, // 配置相关
    "memory":{}, // 内存
}
FaustVM.config.proxy = false; // 是否开启代理
FaustVM.config.print = true; // 是否输出日志
FaustVM.memory.symbolProxy = Symbol("proxy");// 独一无二的属性, 标记是否已代理
FaustVM.memory.symbolData = Symbol("data");// 用来保存当前对象上的原型属性
FaustVM.memory.tag = []; // 内存，存储tag标签
FaustVM.memory.filterProxyProp =[FaustVM.memory.symbolProxy,FaustVM.memory.symbolData,Symbol.toPrimitive,Symbol.toStringTag, "eval"];// 需要过滤的属性
FaustVM.memory.asyncEvent = {};// 异步事件
FaustVM.memory.globalVar = {};// 存取全局变量
FaustVM.memory.globalVar.jsonCookie = {};// json格式的cookie
FaustVM.memory.globalVar.fontList = ["SimHei", "SimSun", "NSimSun", "FangSong", "KaiTi"]; // 浏览器能够识别的字体
FaustVM.memory.globalVar.timeoutID = 0;
// FaustVM.memory.globalVar.all = new ldObj();


