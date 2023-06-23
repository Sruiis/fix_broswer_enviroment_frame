// 全局对象配置
debugger;

FaustVM = {
    "toolsFunc":{},
    "envFunc":{},// 具体环境实现相关
    "config":{}, // 配置相关
    "memory":{}, // 内存相关
}

FaustVM.config.proxy = false    // 是否开启代理
FaustVM.config.print = true; // 是否输出日志
FaustVM.memory.symbolProxy = Symbol("proxy"); // 独一无二的属性,标记是否已代理
FaustVM.memory.symbolData = Symbol("data");// 用来保存当前对象上的原型属性
FaustVM.memory.tag = []; // 内存，存储tag标签
FaustVM.memory.filterProxyProp =[FaustVM.memory.symbolProxy, "eval"];// 需要过滤的属性
FaustVM.memory.globalVar = {}// 存取全局变量
FaustVM.memory.globalVar.jsonCookie ={};// Json格式cookie
// 插件功能相关
!function (){
    // 创建pluginArray
    FaustVM.toolsFunc.createPluginArray = function createPluginArray(){
        let pluginArray = {};
        pluginArray = FaustVM.toolsFunc.createProxyObj(pluginArray, PluginArray, "pluginArray");
        FaustVM.toolsFunc.setProtoArr.call(pluginArray, "length", 0);
        return pluginArray;
    }
    // 添加Plugin
    FaustVM.toolsFunc.addPlugin = function addPlugin(plugin){
        let pluginArray = FaustVM.memory.globalVar.pluginArray;
        if(pluginArray === undefined){
            pluginArray = FaustVM.toolsFunc.createPluginArray();
        }
        let index = pluginArray.length;
        pluginArray[index] = plugin;
        Object.defineProperty(pluginArray, plugin.name, {value: plugin, writable: false, enumerable: false, configurable: true});
        FaustVM.toolsFunc.setProtoArr.call(pluginArray, "length", index+1);
        FaustVM.memory.globalVar.pluginArray = pluginArray;
        return pluginArray;
    }
    // 创建MimeTypeArray对象
    FaustVM.toolsFunc.createMimeTypeArray = function createMimeTypeArray(){
        let mimeTypeArray = {};
        mimeTypeArray = FaustVM.toolsFunc.createProxyObj(mimeTypeArray, MimeTypeArray, "mimeTypeArray");
        FaustVM.toolsFunc.setProtoArr.call(mimeTypeArray, "length", 0);
        return mimeTypeArray;
    }
    // 添加MimeType
    FaustVM.toolsFunc.addMimeType = function addMimeType(mimeType){
        let mimeTypeArray = FaustVM.memory.globalVar.mimeTypeArray;
        if(mimeTypeArray === undefined){
            mimeTypeArray = FaustVM.toolsFunc.createMimeTypeArray();
        }
        let index = mimeTypeArray.length;
        let flag = true;
        for(let i=0;i<index;i++){
            if(mimeTypeArray[i].type === mimeType.type){
                flag = false;
            }
        }
        if(flag){
            mimeTypeArray[index] = mimeType;
            Object.defineProperty(mimeTypeArray, mimeType.type, {value: mimeType, writable: false, enumerable: false, configurable: true});
            FaustVM.toolsFunc.setProtoArr.call(mimeTypeArray, "length", index+1);
        }
        FaustVM.memory.globalVar.mimeTypeArray = mimeTypeArray;
        return mimeTypeArray;
    }

    // 创建MimeType
    FaustVM.toolsFunc.createMimeType = function createMimeType(mimeTypeJson, plugin){
        let mimeType = {};
        FaustVM.toolsFunc.createProxyObj(mimeType, MimeType, "mimeType");
        FaustVM.toolsFunc.setProtoArr.call(mimeType, "description", mimeTypeJson.description);
        FaustVM.toolsFunc.setProtoArr.call(mimeType, "suffixes", mimeTypeJson.suffixes);
        FaustVM.toolsFunc.setProtoArr.call(mimeType, "type", mimeTypeJson.type);
        FaustVM.toolsFunc.setProtoArr.call(mimeType, "enabledPlugin", plugin);
        FaustVM.toolsFunc.addMimeType(mimeType);
        return mimeType;
    }

    // 创建plugin
    FaustVM.toolsFunc.createPlugin = function createPlugin(data){
        let mimeTypes = data.mimeTypes;
        let plugin = {};
        plugin = FaustVM.toolsFunc.createProxyObj(plugin, Plugin, "plugin");
        FaustVM.toolsFunc.setProtoArr.call(plugin, "description", data.description);
        FaustVM.toolsFunc.setProtoArr.call(plugin, "filename", data.filename);
        FaustVM.toolsFunc.setProtoArr.call(plugin, "name", data.name);
        FaustVM.toolsFunc.setProtoArr.call(plugin, "length", mimeTypes.length);
        for(let i=0; i<mimeTypes.length; i++){
            let mimeType = FaustVM.toolsFunc.createMimeType(mimeTypes[i], plugin);
            plugin[i] = mimeType;
            Object.defineProperty(plugin, mimeTypes[i].type, {value: mimeType, writable: false, enumerable: false, configurable: true});
        }
        FaustVM.toolsFunc.addPlugin(plugin);
        return plugin;
    }

    // 解析URL属性
    FaustVM.toolsFunc.parseUrl = function parseUrl(str) {
        if (!parseUrl || !parseUrl.options) {
            parseUrl.options = {
                strictMode: false,
                key: ["href", "protocol", "host", "userInfo", "user", "password", "hostname", "port", "relative", "pathname", "directory", "file", "search", "hash"],
                q: {
                    name: "queryKey",
                    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
                },
                parser: {
                    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                }
            };
        }
        if (!str) {
            return '';
        }
        var o = parseUrl.options,
            m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
            urlJson = {},
            i = 14;
        while (i--) urlJson[o.key[i]] = m[i] || "";
        urlJson[o.q.name] = {};
        urlJson[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
            if ($1) urlJson[o.q.name][$1] = $2;
        });
        delete  urlJson["queryKey"];
        delete  urlJson["userInfo"];
        delete  urlJson["user"];
        delete  urlJson["password"];
        delete  urlJson["relative"];
        delete  urlJson["directory"];
        delete  urlJson["file"];
        urlJson["protocol"] += ":";
        urlJson["origin"] = urlJson["protocol"] + "//" + urlJson["host"];
        urlJson["search"] = urlJson["search"] && "?" + urlJson["search"];
        urlJson["hash"] = urlJson["hash"] && "#" + urlJson["hash"];
        return urlJson;
    }

    // 单标签字符串解析
    FaustVM.toolsFunc.getTagJson = function getTagJson(tagStr){
        let arrList = tagStr.match("<(.*?)>")[1].split(" ");
        let tagJson = {};
        tagJson["type"] = arrList[0];
        tagJson["prop"] = {};
        for(let i=1;i<arrList.length;i++){
            let item = arrList[i].split("=");
            let key = item[0];
            let value = item[1].replaceAll("\"","").replaceAll("'","");
            tagJson["prop"][key] = value;
        }
        return tagJson;
    }


    FaustVM.toolsFunc.getCollection = function getCollection(type){
        let collection = [];
        for (let i = 0; i < FaustVM.memory.tag.length; i++) {
            let tag = FaustVM.memory.tag[i];
            if(FaustVM.toolsFunc.getType(tag) === type){
                collection.push(tag);
            }
        }
        return collection;
    }

    // 获取原型对象上自身属性值
    FaustVM.toolsFunc.getProtoArr = function getProtoArr(key){
        return this[FaustVM.memory.symbolData] && this[FaustVM.memory.symbolData][key];
    }
     // 设置原型对象上自身属性值
    FaustVM.toolsFunc.setProtoArr = function setProtoArr(key, value){
        if(!(FaustVM.memory.symbolData in this)){
            Object.defineProperty(this, FaustVM.memory.symbolData, {
                enumerable:false,
                configurable:false,
                writable:true,
                value:{}
            });
        }
        this[FaustVM.memory.symbolData][key] = value;
    }

    // 获取一个自增的ID
    FaustVM.toolsFunc.getID = function getID(){
        if(FaustVM.memory.ID === undefined){
            FaustVM.memory.ID = 0;
        }
        FaustVM.memory.ID += 1;
        return FaustVM.memory.ID;
    }

    // 代理原型对象
    FaustVM.toolsFunc.createProxyObj = function createProxyObj(obj, proto, name){
        Object.setPrototypeOf(obj,proto.prototype);
        return FaustVM.toolsFunc.proxy(obj, `${name}_ID(${FaustVM.toolsFunc.getID()})`);
    }
    // hook 插件
    FaustVM.toolsFunc.hook = function hook(func, funcInfo, isDebug, onEnter, onLeave, isExec){
        // func ： 原函数，需要hook的函数
        // funcInfo: 是一个对象，objName，funcName属性
        // isDebug: 布尔类型, 是否进行调试，关键点定位，回溯调用栈
        // onEnter：函数， 原函数执行前执行的函数，改原函数入参，或者输出入参
        // onLeave： 函数，原函数执行完之后执行的函数，改原函数的返回值，或者输出原函数的返回值
        // isExec ： 布尔， 是否执行原函数，比如无限debuuger函数
        if(typeof func !== 'function'){
            return func;
        }
        if(funcInfo === undefined){
            funcInfo = {};
            funcInfo.objName = "globalThis";
            funcInfo.funcName = func.name || '';
        }
        if(isDebug === undefined){
            isDebug = false;
        }
        if(!onEnter){
            onEnter = function (obj){
                console.log(`{hook|${funcInfo.objName}[${funcInfo.funcName}]正在调用，参数是${JSON.stringify(obj.args)}}`);
            }
        }
        if(!onLeave){
            onLeave = function (obj){
                console.log(`{hook|${funcInfo.objName}[${funcInfo.funcName}]正在调用，返回值是[${obj.result}}]`);
            }
        }
        if(isExec === undefined){
            isExec = true;
        }
        // 替换的函数
        let hookFunc = function (){
            if(isDebug){
                debugger;
            }
            let obj = {};
            obj.args = [];
            for (let i=0;i<arguments.length;i++){
                obj.args[i] = arguments[i];
            }
            // 原函数执行前
            onEnter.call(this, obj); // onEnter(obj);
            // 原函数正在执行
            let result;
            if(isExec){
                result = func.apply(this, obj.args);
            }
            obj.result = result;
            // 原函数执行后
            onLeave.call(this, obj); // onLeave(obj);
            // 返回结果
            return obj.result;
        }
        // hook 后的函数进行native
        FaustVM.toolsFunc.setNative(hookFunc, funcInfo.funcName);
        FaustVM.toolsFunc.reNameFunc(hookFunc, funcInfo.funcName);
        return hookFunc;
    }
    // hook 对象的属性，本质是替换属性描述符
    FaustVM.toolsFunc.hookObj = function hookObj(obj, objName, propName, isDebug){
        // obj :需要hook的对象
        // objName: hook对象的名字
        // propName： 需要hook的对象属性名
        // isDubug: 是否需要debugger
        let oldDescriptor = Object.getOwnPropertyDescriptor(obj, propName);
        let newDescriptor = {};
        if(!oldDescriptor.configurable){ // 如果是不可配置的，直接返回
            return;
        }
        // 必须有的属性描述
        newDescriptor.configurable = true;
        newDescriptor.enumerable = oldDescriptor.enumerable;
        if(oldDescriptor.hasOwnProperty("writable")){
            newDescriptor.writable = oldDescriptor.writable;
        }
        if(oldDescriptor.hasOwnProperty("value")){
            let value = oldDescriptor.value;
            if(typeof value !== "function"){
                return;
            }
            let funcInfo = {
                "objName": objName,
                "funcName": propName
            }
            newDescriptor.value = FaustVM.toolsFunc.hook(value,funcInfo ,isDebug);
        }
        if(oldDescriptor.hasOwnProperty("get")){
            let get = oldDescriptor.get;
            let funcInfo = {
                "objName": objName,
                "funcName": `get ${propName}`
            }
            newDescriptor.get = FaustVM.toolsFunc.hook(get,funcInfo ,isDebug);
        }
        if(oldDescriptor.hasOwnProperty("set")){
            let set = oldDescriptor.set;
            let funcInfo = {
                "objName": objName,
                "funcName": `set ${propName}`
            }
            newDescriptor.set = FaustVM.toolsFunc.hook(set,funcInfo ,isDebug);
        }
        Object.defineProperty(obj, propName, newDescriptor);
    }
    // hook 原型对象的所有属性
    FaustVM.toolsFunc.hookProto = function hookProto(proto, isDebug){
        // proto :函数原型
        // isDebug: 是否debugger
        let protoObj = proto.prototype;
        let name = proto.name;
        for(const prop in Object.getOwnPropertyDescriptors(protoObj)){
            FaustVM.toolsFunc.hookObj(protoObj, `${name}.prototype`, prop, isDebug);
        }
        console.log(`hook ${name}.prototype`);
    }
    // 获取对象类型
    FaustVM.toolsFunc.getType = function getType(obj){
        return Object.prototype.toString.call(obj);
    }

    // 过滤代理属性
    FaustVM.toolsFunc.filterProxyProp = function filterProxyProp(prop){
        for(let i=0;i<FaustVM.memory.filterProxyProp.length;i++){
            if(FaustVM.memory.filterProxyProp[i] === prop){
                return true;
            }
        }
        return false;
    }

    // proxy代理器
    FaustVM.toolsFunc.proxy = function proxy(obj, objName){
        // obj: 原始对象
        // objName: 原始对象的名字
        if(!FaustVM.config.proxy){
            return obj;
        }
        if(FaustVM.memory.symbolProxy in obj){// 判断对象obj是否是已代理的对象
            return obj[FaustVM.memory.symbolProxy];
        }
        let handler = {
            get:function (target,prop,receiver){// 三个参数
                let result;
                try {//防止报错
                    result = Reflect.get(target,prop,receiver);
                    if(FaustVM.toolsFunc.filterProxyProp(prop)){
                        return result;
                    }
                    let type = FaustVM.toolsFunc.getType(result);
                    if(result instanceof Object){
                        console.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],type:[${type}]}`);
                        // 递归代理
                        result = FaustVM.toolsFunc.proxy(result, `${objName}.${prop.toString()}`);
                    }else if(typeof result === "symbol"){
                        console.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],ret:[${result.toString()}]}`);
                    }else{
                        console.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],ret:[${result}]}`);
                    }

                }catch (e) {
                    console.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
                }
                return result;
            },
            set:function (target,prop,value,receiver){
                let result;
                try{
                    result = Reflect.set(target,prop,value,receiver);
                    let type = FaustVM.toolsFunc.getType(value);
                    if(value instanceof Object){
                        console.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],type:[${type}]}`);
                    }else if(typeof value === "symbol"){
                        console.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],value:[${value.toString()}]}`);
                    }else{
                        console.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],value:[${value}]}`);
                    }
                }catch (e){
                    console.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
                }
                return result;
            },
            getOwnPropertyDescriptor:function (target, prop){
                let result;// undefined, 描述符对象
                try{
                    result = Reflect.getOwnPropertyDescriptor(target, prop);
                    let type = FaustVM.toolsFunc.getType(result);
                    if("constructor" !== prop){
                        console.log(`{getOwnPropertyDescriptor|obj:[${objName}] -> prop:[${prop.toString()}],type:[${type}]}`);
                    }
                    // if(typeof result !== "undefined"){
                    //     result = FaustVM.toolsFunc.proxy(result, `${objName}.${prop.toString()}.PropertyDescriptor`);
                    // }
                }catch (e){
                     console.log(`{getOwnPropertyDescriptor|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
                }
                return result;
            },
            defineProperty: function (target, prop, descriptor){
                let result;
                try{
                    result = Reflect.defineProperty(target, prop, descriptor);
                    console.log(`{defineProperty|obj:[${objName}] -> prop:[${prop.toString()}]}`);
                }catch (e) {
                    console.log(`{defineProperty|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
                }
                return result;
            },
            apply:function (target, thisArg, argumentsList){
                // target: 函数对象
                // thisArg: 调用函数的this指针
                // argumentsList: 数组， 函数的入参组成的一个列表
                let result;
                try{
                    result = Reflect.apply(target, thisArg, argumentsList);
                    let type = FaustVM.toolsFunc.getType(result);
                    if(result instanceof Object){
                        console.log(`{apply|function:[${objName}], args:[${argumentsList}], type:[${type}]}`);
                    }else if(typeof result === "symbol"){
                        console.log(`{apply|function:[${objName}], args:[${argumentsList}] result:[${result.toString()}]}`);
                    }else{
                        console.log(`{apply|function:[${objName}], args:[${argumentsList}] result:[${result}]}`);
                    }
                }catch (e) {
                    console.log(`{apply|function:[${objName}], args:[${argumentsList}] error:[${e.message}]}`);
                }
                return result;
            },
            construct:function (target, argArray, newTarget) {
                // target: 函数对象
                // argArray： 参数列表
                // newTarget：代理对象
                let result;
                try{
                    result = Reflect.construct(target, argArray, newTarget);
                    let type = FaustVM.toolsFunc.getType(result);
                    console.log(`{construct|function:[${objName}], type:[${type}]}`);
                }catch (e) {
                    console.log(`{construct|function:[${objName}],error:[${e.message}]}`);
                }
                return result;

            },
            deleteProperty:function (target, propKey){
                let result = Reflect.deleteProperty(target, propKey);
                console.log(`{deleteProperty|obj:[${objName}] -> prop:[${propKey.toString()}], result:[${result}]}`);
                return result;
            },
            has:function (target, propKey){ // in 操作符
                let result = Reflect.has(target, propKey);
                if(propKey !== FaustVM.memory.symbolProxy){
                    console.log(`{has|obj:[${objName}] -> prop:[${propKey.toString()}], result:[${result}]}`);
                }
                return result;
            },
            ownKeys: function (target){
                let result = Reflect.ownKeys(target);
                console.log(`{ownKeys|obj:[${objName}]}`);
                return result
            },
            getPrototypeOf:function(target){
                let result = Reflect.getPrototypeOf(target);
                console.log(`{getPrototypeOf|obj:[${objName}]}`);
                return result;
            },
            setPrototypeOf:function(target, proto){
                let result = Reflect.setPrototypeOf(target, proto);
                console.log(`{setPrototypeOf|obj:[${objName}]}`);
                return result;
            },
            preventExtensions:function(target){
                let result = Reflect.preventExtensions(target, proto);
                console.log(`{preventExtensions|obj:[${objName}]}`);
                return result;
            },
            isExtensible:function(target){
                let result = Reflect.isExtensible(target, proto);
                console.log(`{isExtensible|obj:[${objName}]}`);
                return result;
            }
        };
        let proxyObj = new Proxy(obj, handler);
        Object.defineProperty(obj, FaustVM.memory.symbolProxy, {
            configurable:false,
            enumerable:false,
            writable:false,
            value:proxyObj
        });
        return proxyObj;
}
    // env函数分发器
    FaustVM.toolsFunc.dispatch = function dispatch(self, obj, objName, funcName, argList, defaultValue){
        let name = `${objName}_${funcName}`; // EventTarget_addEventListener
        if(Object.getOwnPropertyDescriptor(obj, "constructor") !== undefined){
            if(Object.getOwnPropertyDescriptor(self, "constructor") !== undefined){
                // self 不是实例对象
                return FaustVM.toolsFunc.throwError('TypeError', 'Illegal invocation');
            }
        }
        try{
            return FaustVM.envFunc[name].apply(self, argList);
        }catch (e){
            if(defaultValue === undefined){
                console.log(`[${name}]正在执行，错误信息: ${e.message}`);
            }
            return defaultValue;
        }
    }
    // 定义对象属性defineProperty
    FaustVM.toolsFunc.defineProperty = function defineProperty(obj, prop, oldDescriptor){
        let newDescriptor = {};
        newDescriptor.configurable = FaustVM.config.proxy || oldDescriptor.configurable;// 如果开启代理必须是true
        newDescriptor.enumerable = oldDescriptor.enumerable;
        if(oldDescriptor.hasOwnProperty("writable")){
            newDescriptor.writable = FaustVM.config.proxy || oldDescriptor.writable;// 如果开启代理必须是true
        }
        if(oldDescriptor.hasOwnProperty("value")){
            let value = oldDescriptor.value;
            if(typeof value === "function"){
                FaustVM.toolsFunc.safeFunc(value, prop);
            }
            newDescriptor.value = value;
        }
        if(oldDescriptor.hasOwnProperty("get")){
            let get = oldDescriptor.get;
            if(typeof get === "function"){
                FaustVM.toolsFunc.safeFunc(get, `get ${prop}`);
            }
            newDescriptor.get = get;
        }
        if(oldDescriptor.hasOwnProperty("set")){
            let set = oldDescriptor.set;
            if(typeof set === "function"){
                FaustVM.toolsFunc.safeFunc(set, `set ${prop}`);
            }
            newDescriptor.set = set;
        }
        Object.defineProperty(obj, prop, newDescriptor);
    }
    // 函数native化
    !function (){
        const $toString = Function.prototype.toString;
        const symbol = Symbol(); // 独一无二的属性
        const myToString = function (){
            return typeof this === 'function' && this[symbol] || $toString.call(this);
        }
        function set_native(func, key, value){
            Object.defineProperty(func, key, {
                enumerable: false,
                configurable: true,
                writable: true,
                value: value
            });
        }
        delete Function.prototype.toString;
        set_native(Function.prototype, "toString", myToString);
        set_native(Function.prototype.toString, symbol, "function toString() { [native code] }");
        FaustVM.toolsFunc.setNative = function (func, funcname) {
            set_native(func, symbol, `function ${funcname || func.name || ''}() { [native code] }`);
        }
    }();
    // 对象重命名
    FaustVM.toolsFunc.reNameObj = function reNameObj(obj, name){
        Object.defineProperty(obj.prototype, Symbol.toStringTag, {
            configurable:true,
            enumerable:false,
            value:name,
            writable:false
        });
    }
    // 函数重命名
    FaustVM.toolsFunc.reNameFunc = function reNameFunc(func, name){
        Object.defineProperty(func, "name", {
            configurable:true,
            enumerable:false,
            writable:false,
            value:name
        });
    }
    // 函数保护方法
    FaustVM.toolsFunc.safeFunc = function safeFunc(func, name){
        FaustVM.toolsFunc.setNative(func, name);
        FaustVM.toolsFunc.reNameFunc(func, name);
    }
    // 原型保护方法
    FaustVM.toolsFunc.safeProto = function safeProto(obj, name){
        FaustVM.toolsFunc.setNative(obj, name);
        FaustVM.toolsFunc.reNameObj(obj, name);
    }
    // 抛错函数
    FaustVM.toolsFunc.throwError = function throwError(name, message){
        let e = new Error();
        e.name = name;
        e.message = message;
        e.stack = `${name}: ${message}\n    at snippet://`;
        throw e;
    }
    // base64编码解码
    FaustVM.toolsFunc.base64 = {};
    FaustVM.toolsFunc.base64.base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    FaustVM.toolsFunc.base64.base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    FaustVM.toolsFunc.base64.base64encode = function base64encode(str) {
      var out, i, len;
      var c1, c2, c3;

      len = str.length;
      i = 0;
      out = "";
      while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
          out += FaustVM.toolsFunc.base64.base64EncodeChars.charAt(c1 >> 2);
          out += FaustVM.toolsFunc.base64.base64EncodeChars.charAt((c1 & 0x3) << 4);
          out += "==";
          break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
          out += FaustVM.toolsFunc.base64.base64EncodeChars.charAt(c1 >> 2);
          out += FaustVM.toolsFunc.base64.base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
          out += FaustVM.toolsFunc.base64.base64EncodeChars.charAt((c2 & 0xF) << 2);
          out += "=";
          break;
        }
        c3 = str.charCodeAt(i++);
        out += FaustVM.toolsFunc.base64.base64EncodeChars.charAt(c1 >> 2);
        out += FaustVM.toolsFunc.base64.base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += FaustVM.toolsFunc.base64.base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += FaustVM.toolsFunc.base64.base64EncodeChars.charAt(c3 & 0x3F);
      }
      return out;
    }
    FaustVM.toolsFunc.base64.base64decode = function base64decode(str) {
      var c1, c2, c3, c4;
      var i, len, out;

      len = str.length;
      i = 0;
      out = "";
      while (i < len) {
        /* c1 */
        do {
          c1 = FaustVM.toolsFunc.base64.base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1)
          break;

        /* c2 */
        do {
          c2 = FaustVM.toolsFunc.base64.base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1)
          break;

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        /* c3 */
        do {
          c3 = str.charCodeAt(i++) & 0xff;
          if (c3 == 61)
            return out;
          c3 = FaustVM.toolsFunc.base64.base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1)
          break;

        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

        /* c4 */
        do {
          c4 = str.charCodeAt(i++) & 0xff;
          if (c4 == 61)
            return out;
          c4 = FaustVM.toolsFunc.base64.base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1)
          break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
      }
      return out;
    }

}();
// 浏览器接口具体的实现
!function (){
    FaustVM.envFunc.MimeTypeArray_namedItem = function MimeTypeArray_namedItem(){
        let name = arguments[0];
        return this[name];
    }
    FaustVM.envFunc.MimeTypeArray_item = function MimeTypeArray_item(){
        let index = arguments[0];
        return this[index];
    }
    FaustVM.envFunc.Plugin_namedItem = function Plugin_namedItem(){
        let name = arguments[0];
        return this[name];
    }
    FaustVM.envFunc.Plugin_item = function Plugin_item(){
        let index = arguments[0];
        return this[index];
    }
    FaustVM.envFunc.PluginArray_namedItem = function PluginArray_namedItem(){
        let name = arguments[0];
        return this[name];
    }
    FaustVM.envFunc.PluginArray_item = function PluginArray_item(){
        let index = arguments[0];
        return this[index];
    }
    FaustVM.envFunc.Navigator_mimeTypes_get = function Navigator_mimeTypes_get(){
        return FaustVM.memory.globalVar.mimeTypeArray;
    }
    FaustVM.envFunc.MimeType_suffixes_get = function MimeType_suffixes_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "suffixes");
    }
    FaustVM.envFunc.MimeType_enabledPlugin_get = function MimeType_enabledPlugin_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "enabledPlugin");
    }
    FaustVM.envFunc.MimeType_description_get = function MimeType_description_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "description");
    }
    FaustVM.envFunc.Plugin_length_get = function Plugin_length_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "length");
    }
    FaustVM.envFunc.Plugin_filename_get = function Plugin_filename_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "filename");
    }
    FaustVM.envFunc.Plugin_description_get = function Plugin_description_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "description");
    }
    FaustVM.envFunc.Plugin_name_get = function Plugin_name_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "name");
    }
    FaustVM.envFunc.PluginArray_length_get = function PluginArray_length_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "length");
    }
    FaustVM.envFunc.MimeType_type_get = function MimeType_type_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "type");
    }
    FaustVM.envFunc.MimeTypeArray_length_get = function MimeTypeArray_length_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "length");
    }
    FaustVM.envFunc.Navigator_plugins_get = function Navigator_plugins_get(){
        return FaustVM.memory.globalVar.pluginArray;
    }
    FaustVM.envFunc.HTMLAnchorElement_hash_get = function HTMLAnchorElement_hash_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "hash");
    }
    FaustVM.envFunc.HTMLAnchorElement_origin_get = function HTMLAnchorElement_origin_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "origin");
    }
    FaustVM.envFunc.HTMLAnchorElement_search_get = function HTMLAnchorElement_search_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "search");
    }
    FaustVM.envFunc.HTMLAnchorElement_hostname_get = function HTMLAnchorElement_hostname_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "hostname");
    }
    FaustVM.envFunc.HTMLAnchorElement_protocol_get = function HTMLAnchorElement_protocol_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "protocol");
    }
    FaustVM.envFunc.HTMLAnchorElement_href_get = function HTMLAnchorElement_href_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "href");
    }
    FaustVM.envFunc.HTMLAnchorElement_href_set = function HTMLAnchorElement_href_set(){
        let url = arguments[0];
        if(url.indexOf("http") === -1){
            url = location.protocol + "//" + location.hostname + url;
        }
        let jsonUrl = FaustVM.toolsFunc.parseUrl(url);
        FaustVM.toolsFunc.setProtoArr.call(this, "origin", jsonUrl["origin"]);
        FaustVM.toolsFunc.setProtoArr.call(this, "protocol", jsonUrl["protocol"]);
        FaustVM.toolsFunc.setProtoArr.call(this, "host", jsonUrl["host"]);
        FaustVM.toolsFunc.setProtoArr.call(this, "hostname", jsonUrl["hostname"]);
        FaustVM.toolsFunc.setProtoArr.call(this, "port", jsonUrl["port"]);
        FaustVM.toolsFunc.setProtoArr.call(this, "pathname", jsonUrl["pathname"]);
        FaustVM.toolsFunc.setProtoArr.call(this, "search", jsonUrl["search"]);
        FaustVM.toolsFunc.setProtoArr.call(this, "hash", jsonUrl["hash"]);
        FaustVM.toolsFunc.setProtoArr.call(this, "href", jsonUrl["href"]);
    }
    FaustVM.envFunc.location_hostname_get = function location_hostname_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "hostname");
    }
    FaustVM.envFunc.location_hostname_set = function location_hostname_set(){
        let value = arguments[0];
        return FaustVM.toolsFunc.setProtoArr.call(this, "hostname", value);
    }
    FaustVM.envFunc.location_protocol_get = function location_protocol_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "protocol");
    }
    FaustVM.envFunc.location_protocol_set = function location_protocol_set(){
        let value = arguments[0];
        return FaustVM.toolsFunc.setProtoArr.call(this, "protocol", value);
    }
    FaustVM.envFunc.HTMLInputElement_value_get = function HTMLInputElement_value_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "value");
    }
    FaustVM.envFunc.HTMLInputElement_value_set = function HTMLInputElement_value_set(){
        let value = arguments[0];
        FaustVM.toolsFunc.setProtoArr.call(this, "value", value);
    }
    FaustVM.envFunc.HTMLInputElement_name_get = function HTMLInputElement_name_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "name");
    }
    FaustVM.envFunc.HTMLInputElement_name_set = function HTMLInputElement_name_set(){
        let value = arguments[0];
        FaustVM.toolsFunc.setProtoArr.call(this, "name", value);
    }
    FaustVM.envFunc.Element_id_get = function Element_id_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "id");
    }
    FaustVM.envFunc.Element_id_set = function Element_id_set(){
        let value = arguments[0];
        FaustVM.toolsFunc.setProtoArr.call(this, "id", value);
    }
    FaustVM.envFunc.HTMLInputElement_type_get = function HTMLInputElement_type_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "type");
    }
    FaustVM.envFunc.HTMLInputElement_type_set = function HTMLInputElement_type_set(){
        let value = arguments[0];
        FaustVM.toolsFunc.setProtoArr.call(this, "type", value);
    }
    FaustVM.envFunc.Node_removeChild = function Node_removeChild(){

    }
    FaustVM.envFunc.Node_parentNode_get = function Node_parentNode_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "parentNode");
    }
    FaustVM.envFunc.HTMLMetaElement_content_get = function HTMLMetaElement_content_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "content");
    }
    FaustVM.envFunc.HTMLMetaElement_content_set = function HTMLMetaElement_content_set(){
        let value = arguments[0];
        return FaustVM.toolsFunc.setProtoArr.call(this, "content", value);
    }
    FaustVM.envFunc.HTMLDivElement_align_get = function HTMLDivElement_align_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "align");
    }
    FaustVM.envFunc.HTMLDivElement_align_set = function HTMLDivElement_align_set(){
        let value = arguments[0];
        return FaustVM.toolsFunc.setProtoArr.call(this, "align", value);
    }
    FaustVM.envFunc.Storage_setItem = function Storage_setItem(){
        let keyName = arguments[0];
        let keyValue = arguments[1];
        this[keyName] = keyValue;
    }
    FaustVM.envFunc.Storage_getItem = function Storage_getItem(){
        let key = arguments[0];
        if(key in this){
            return this[key];
        }
        return null;
    }
    FaustVM.envFunc.Storage_removeItem = function Storage_removeItem(){
        let key = arguments[0];
        delete this[key];
    }
    FaustVM.envFunc.Storage_key = function Storage_key(){
        let index = arguments[0];
        let i = 0;
        for (const key in this) {
            if(i === index){
                return key;
            }
            i++;
        }
        return null;
    }
    FaustVM.envFunc.Storage_clear = function Storage_clear(){
        for (const key in this) {
            delete this[key];
        }
    }
    FaustVM.envFunc.Storage_length_get = function Storage_length_get(){
        let i = 0;
        for (const key in Object.getOwnPropertyDescriptors(this)) {
            i++;
        }
        return i;
    }
    FaustVM.envFunc.Document_createElement = function Document_createElement(){
        let tagName = arguments[0].toLowerCase();
        let options = arguments[1];
        let tag = {};
        switch (tagName){
            case "div":
                tag = FaustVM.toolsFunc.createProxyObj(tag,HTMLDivElement,`Document_createElement_${tagName}`);
                FaustVM.memory.tag.push(tag);
                break;
            case "meta":
                tag = FaustVM.toolsFunc.createProxyObj(tag,HTMLMetaElement,`Document_createElement_${tagName}`);
                FaustVM.memory.tag.push(tag);
                break;
            case "head":
                tag = FaustVM.toolsFunc.createProxyObj(tag,HTMLHeadElement,`Document_createElement_${tagName}`);
                FaustVM.memory.tag.push(tag);
                break;
            case "input":
                tag = FaustVM.toolsFunc.createProxyObj(tag,HTMLInputElement,`Document_createElement_${tagName}`);
                FaustVM.memory.tag.push(tag);
                break;
             case "a":
                tag = FaustVM.toolsFunc.createProxyObj(tag,HTMLAnchorElement,`Document_createElement_${tagName}`);
                FaustVM.memory.tag.push(tag);
                break;
            default:
                console.log(`Document_createElement_${tagName}未实现`);
                break;
        }
        return tag;
    }
    FaustVM.envFunc.Document_getElementsByTagName = function Document_getElementsByTagName(){
        let tagName = arguments[0].toLowerCase();
        let collection = [];
        switch (tagName){
            case "meta":
                collection = FaustVM.toolsFunc.getCollection('[object HTMLMetaElement]');
                collection = FaustVM.toolsFunc.createProxyObj(collection, HTMLCollection, `Document_getElementsByTagName_${tagName}`)
                break;
            default:
                console.log(`Document_getElementsByTagName_${tagName}未实现`);
                break;
        }
        return collection;
    }
    FaustVM.envFunc.Document_write = function Document_write(){
        let tagStr = arguments[0];
        // 解析标签字符串
        // '<input type="hidden" id="test" name="inputTag" value="666">'
        let tagJson = FaustVM.toolsFunc.getTagJson(tagStr);
        let tag = document.createElement(tagJson.type);
        for(const key in tagJson.prop){
            debugger;
            tag[key] = tagJson.prop[key];
            if(tag[key] === undefined){
                FaustVM.toolsFunc.setProtoArr.call(tag, key, tagJson.prop[key]);
            }
        }
    }
    FaustVM.envFunc.Document_getElementById = function Document_getElementById(){
        let id = arguments[0];
        let tags = FaustVM.memory.tag;
        debugger;
        for (let i = 0; i <tags.length; i++) {
            if(tags[i].id === id){
                return tags[i];
            }
        }
        return null;
    }
    FaustVM.envFunc.Document_cookie_get = function Document_cookie_get(){
        let jsonCookie = FaustVM.memory.globalVar.jsonCookie;
        let tempCookie = "";
        for(const key in jsonCookie){
            if(key === ""){
                tempCookie += `${jsonCookie[key]}; `;
            }else{
                tempCookie += `${key}=${jsonCookie[key]}; `;
            }
        }
        return tempCookie;
    }
    FaustVM.envFunc.Document_cookie_set = function Document_cookie_set(){
        let cookieValue = arguments[0];
        let index = cookieValue.indexOf(";");
        if(index !== -1){
            cookieValue = cookieValue.substring(0, index);
        }
        if(cookieValue.indexOf("=") === -1){
            FaustVM.memory.globalVar.jsonCookie[""] = cookieValue.trim();
        }else{
            let item = cookieValue.split("=");
            let k = item[0].trim();
            let v = item[1].trim();
            FaustVM.memory.globalVar.jsonCookie[k] = v;
        }
    }

    FaustVM.envFunc.document_location_get = function document_location_get(){
        return location;
    }
    FaustVM.envFunc.window_top_get = function window_top_get(){
        return window;
    }
    FaustVM.envFunc.window_self_get = function window_self_get(){
        return window;
    }
}();

// EventTarget对象
EventTarget = function EventTarget(){}
FaustVM.toolsFunc.safeProto(EventTarget, "EventTarget");
FaustVM.toolsFunc.defineProperty(EventTarget.prototype, "addEventListener", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, EventTarget.prototype, "EventTarget", "addEventListener", arguments)}});
FaustVM.toolsFunc.defineProperty(EventTarget.prototype, "dispatchEvent", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, EventTarget.prototype, "EventTarget", "dispatchEvent", arguments)}});
FaustVM.toolsFunc.defineProperty(EventTarget.prototype, "removeEventListener", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, EventTarget.prototype, "EventTarget", "removeEventListener", arguments)}});

// WindowProperties对象
WindowProperties = function WindowProperties() {

};
// 保护WindowProperties对象
FaustVM.toolsFunc.safeProto(WindowProperties, 'WindowProperties');

// 删除构造方法
delete WindowProperties.prototype.constructor

// 设置WindowProperties原型对象
Object.setPrototypeOf(WindowProperties.prototype, EventTarget.prototype)
// Window对象
Window = function Window(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(Window, "Window");
Object.setPrototypeOf(Window.prototype, WindowProperties.prototype);
FaustVM.toolsFunc.defineProperty(Window, "TEMPORARY", {configurable:false, enumerable:true, writable:false, value:0});
FaustVM.toolsFunc.defineProperty(Window, "PERSISTENT", {configurable:false, enumerable:true, writable:false, value:1});
FaustVM.toolsFunc.defineProperty(Window.prototype, "TEMPORARY", {configurable:false, enumerable:true, writable:false, value:0});
FaustVM.toolsFunc.defineProperty(Window.prototype, "PERSISTENT", {configurable:false, enumerable:true, writable:false, value:1});

// Storage对象
Storage = function Storage(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(Storage, "Storage");
FaustVM.toolsFunc.defineProperty(Storage.prototype, "length", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Storage.prototype, "Storage", "length_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Storage.prototype, "clear", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Storage.prototype, "Storage", "clear", arguments)}});
FaustVM.toolsFunc.defineProperty(Storage.prototype, "getItem", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Storage.prototype, "Storage", "getItem", arguments)}});
FaustVM.toolsFunc.defineProperty(Storage.prototype, "key", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Storage.prototype, "Storage", "key", arguments)}});
FaustVM.toolsFunc.defineProperty(Storage.prototype, "removeItem", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Storage.prototype, "Storage", "removeItem", arguments)}});
FaustVM.toolsFunc.defineProperty(Storage.prototype, "setItem", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Storage.prototype, "Storage", "setItem", arguments)}});

// localStorage对象
localStorage = {}
Object.setPrototypeOf(localStorage, Storage.prototype);

// sessionStorage对象
sessionStorage = {}
Object.setPrototypeOf(sessionStorage, Storage.prototype);

// Node对象
Node = function Node(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(Node, "Node");
Object.setPrototypeOf(Node.prototype, EventTarget.prototype);
FaustVM.toolsFunc.defineProperty(Node, "ELEMENT_NODE", {configurable:false, enumerable:true, writable:false, value:1});
FaustVM.toolsFunc.defineProperty(Node, "ATTRIBUTE_NODE", {configurable:false, enumerable:true, writable:false, value:2});
FaustVM.toolsFunc.defineProperty(Node, "TEXT_NODE", {configurable:false, enumerable:true, writable:false, value:3});
FaustVM.toolsFunc.defineProperty(Node, "CDATA_SECTION_NODE", {configurable:false, enumerable:true, writable:false, value:4});
FaustVM.toolsFunc.defineProperty(Node, "ENTITY_REFERENCE_NODE", {configurable:false, enumerable:true, writable:false, value:5});
FaustVM.toolsFunc.defineProperty(Node, "ENTITY_NODE", {configurable:false, enumerable:true, writable:false, value:6});
FaustVM.toolsFunc.defineProperty(Node, "PROCESSING_INSTRUCTION_NODE", {configurable:false, enumerable:true, writable:false, value:7});
FaustVM.toolsFunc.defineProperty(Node, "COMMENT_NODE", {configurable:false, enumerable:true, writable:false, value:8});
FaustVM.toolsFunc.defineProperty(Node, "DOCUMENT_NODE", {configurable:false, enumerable:true, writable:false, value:9});
FaustVM.toolsFunc.defineProperty(Node, "DOCUMENT_TYPE_NODE", {configurable:false, enumerable:true, writable:false, value:10});
FaustVM.toolsFunc.defineProperty(Node, "DOCUMENT_FRAGMENT_NODE", {configurable:false, enumerable:true, writable:false, value:11});
FaustVM.toolsFunc.defineProperty(Node, "NOTATION_NODE", {configurable:false, enumerable:true, writable:false, value:12});
FaustVM.toolsFunc.defineProperty(Node, "DOCUMENT_POSITION_DISCONNECTED", {configurable:false, enumerable:true, writable:false, value:1});
FaustVM.toolsFunc.defineProperty(Node, "DOCUMENT_POSITION_PRECEDING", {configurable:false, enumerable:true, writable:false, value:2});
FaustVM.toolsFunc.defineProperty(Node, "DOCUMENT_POSITION_FOLLOWING", {configurable:false, enumerable:true, writable:false, value:4});
FaustVM.toolsFunc.defineProperty(Node, "DOCUMENT_POSITION_CONTAINS", {configurable:false, enumerable:true, writable:false, value:8});
FaustVM.toolsFunc.defineProperty(Node, "DOCUMENT_POSITION_CONTAINED_BY", {configurable:false, enumerable:true, writable:false, value:16});
FaustVM.toolsFunc.defineProperty(Node, "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", {configurable:false, enumerable:true, writable:false, value:32});
FaustVM.toolsFunc.defineProperty(Node.prototype, "nodeType", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "nodeType_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Node.prototype, "nodeName", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "nodeName_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Node.prototype, "baseURI", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "baseURI_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Node.prototype, "isConnected", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "isConnected_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Node.prototype, "ownerDocument", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "ownerDocument_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Node.prototype, "parentNode", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "parentNode_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Node.prototype, "parentElement", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "parentElement_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Node.prototype, "childNodes", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "childNodes_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Node.prototype, "firstChild", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "firstChild_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Node.prototype, "lastChild", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "lastChild_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Node.prototype, "previousSibling", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "previousSibling_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Node.prototype, "nextSibling", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "nextSibling_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Node.prototype, "nodeValue", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "nodeValue_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "nodeValue_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "textContent", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "textContent_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "textContent_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "ELEMENT_NODE", {configurable:false, enumerable:true, writable:false, value:1});
FaustVM.toolsFunc.defineProperty(Node.prototype, "ATTRIBUTE_NODE", {configurable:false, enumerable:true, writable:false, value:2});
FaustVM.toolsFunc.defineProperty(Node.prototype, "TEXT_NODE", {configurable:false, enumerable:true, writable:false, value:3});
FaustVM.toolsFunc.defineProperty(Node.prototype, "CDATA_SECTION_NODE", {configurable:false, enumerable:true, writable:false, value:4});
FaustVM.toolsFunc.defineProperty(Node.prototype, "ENTITY_REFERENCE_NODE", {configurable:false, enumerable:true, writable:false, value:5});
FaustVM.toolsFunc.defineProperty(Node.prototype, "ENTITY_NODE", {configurable:false, enumerable:true, writable:false, value:6});
FaustVM.toolsFunc.defineProperty(Node.prototype, "PROCESSING_INSTRUCTION_NODE", {configurable:false, enumerable:true, writable:false, value:7});
FaustVM.toolsFunc.defineProperty(Node.prototype, "COMMENT_NODE", {configurable:false, enumerable:true, writable:false, value:8});
FaustVM.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_NODE", {configurable:false, enumerable:true, writable:false, value:9});
FaustVM.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_TYPE_NODE", {configurable:false, enumerable:true, writable:false, value:10});
FaustVM.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_FRAGMENT_NODE", {configurable:false, enumerable:true, writable:false, value:11});
FaustVM.toolsFunc.defineProperty(Node.prototype, "NOTATION_NODE", {configurable:false, enumerable:true, writable:false, value:12});
FaustVM.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_POSITION_DISCONNECTED", {configurable:false, enumerable:true, writable:false, value:1});
FaustVM.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_POSITION_PRECEDING", {configurable:false, enumerable:true, writable:false, value:2});
FaustVM.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_POSITION_FOLLOWING", {configurable:false, enumerable:true, writable:false, value:4});
FaustVM.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_POSITION_CONTAINS", {configurable:false, enumerable:true, writable:false, value:8});
FaustVM.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_POSITION_CONTAINED_BY", {configurable:false, enumerable:true, writable:false, value:16});
FaustVM.toolsFunc.defineProperty(Node.prototype, "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", {configurable:false, enumerable:true, writable:false, value:32});
FaustVM.toolsFunc.defineProperty(Node.prototype, "appendChild", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "appendChild", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "cloneNode", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "cloneNode", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "compareDocumentPosition", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "compareDocumentPosition", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "contains", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "contains", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "getRootNode", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "getRootNode", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "hasChildNodes", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "hasChildNodes", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "insertBefore", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "insertBefore", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "isDefaultNamespace", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "isDefaultNamespace", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "isEqualNode", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "isEqualNode", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "isSameNode", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "isSameNode", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "lookupNamespaceURI", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "lookupNamespaceURI", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "lookupPrefix", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "lookupPrefix", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "normalize", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "normalize", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "removeChild", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "removeChild", arguments)}});
FaustVM.toolsFunc.defineProperty(Node.prototype, "replaceChild", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Node.prototype, "Node", "replaceChild", arguments)}});

// Element对象
Element = function Element(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(Element, "Element");
Object.setPrototypeOf(Element.prototype, Node.prototype);
FaustVM.toolsFunc.defineProperty(Element.prototype, "namespaceURI", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "namespaceURI_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "prefix", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "prefix_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "localName", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "localName_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "tagName", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "tagName_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "id", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "id_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "id_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "className", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "className_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "className_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "classList", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "classList_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "classList_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "slot", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "slot_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "slot_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "attributes", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "attributes_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "shadowRoot", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "shadowRoot_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "part", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "part_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "part_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "assignedSlot", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "assignedSlot_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "innerHTML", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "innerHTML_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "innerHTML_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "outerHTML", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "outerHTML_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "outerHTML_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "scrollTop", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollTop_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollTop_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "scrollLeft", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollLeft_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollLeft_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "scrollWidth", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollWidth_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "scrollHeight", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollHeight_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "clientTop", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "clientTop_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "clientLeft", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "clientLeft_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "clientWidth", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "clientWidth_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "clientHeight", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "clientHeight_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "onbeforecopy", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onbeforecopy_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onbeforecopy_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "onbeforecut", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onbeforecut_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onbeforecut_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "onbeforepaste", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onbeforepaste_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onbeforepaste_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "onsearch", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onsearch_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onsearch_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "elementTiming", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "elementTiming_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "elementTiming_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "onfullscreenchange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onfullscreenchange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onfullscreenchange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "onfullscreenerror", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onfullscreenerror_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onfullscreenerror_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "onwebkitfullscreenchange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onwebkitfullscreenchange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onwebkitfullscreenchange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "onwebkitfullscreenerror", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onwebkitfullscreenerror_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "onwebkitfullscreenerror_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "role", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "role_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "role_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaAtomic", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaAtomic_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaAtomic_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaAutoComplete", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaAutoComplete_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaAutoComplete_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaBusy", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaBusy_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaBusy_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaBrailleLabel", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaBrailleLabel_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaBrailleLabel_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaBrailleRoleDescription", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaBrailleRoleDescription_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaBrailleRoleDescription_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaChecked", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaChecked_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaChecked_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaColCount", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaColCount_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaColCount_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaColIndex", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaColIndex_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaColIndex_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaColSpan", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaColSpan_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaColSpan_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaCurrent", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaCurrent_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaCurrent_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaDescription", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaDescription_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaDescription_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaDisabled", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaDisabled_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaDisabled_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaExpanded", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaExpanded_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaExpanded_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaHasPopup", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaHasPopup_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaHasPopup_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaHidden", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaHidden_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaHidden_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaInvalid", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaInvalid_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaInvalid_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaKeyShortcuts", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaKeyShortcuts_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaKeyShortcuts_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaLabel", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaLabel_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaLabel_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaLevel", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaLevel_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaLevel_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaLive", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaLive_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaLive_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaModal", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaModal_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaModal_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaMultiLine", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaMultiLine_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaMultiLine_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaMultiSelectable", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaMultiSelectable_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaMultiSelectable_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaOrientation", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaOrientation_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaOrientation_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaPlaceholder", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaPlaceholder_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaPlaceholder_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaPosInSet", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaPosInSet_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaPosInSet_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaPressed", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaPressed_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaPressed_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaReadOnly", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaReadOnly_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaReadOnly_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaRelevant", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRelevant_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRelevant_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaRequired", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRequired_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRequired_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaRoleDescription", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRoleDescription_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRoleDescription_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaRowCount", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRowCount_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRowCount_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaRowIndex", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRowIndex_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRowIndex_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaRowSpan", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRowSpan_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaRowSpan_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaSelected", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaSelected_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaSelected_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaSetSize", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaSetSize_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaSetSize_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaSort", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaSort_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaSort_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaValueMax", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueMax_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueMax_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaValueMin", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueMin_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueMin_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaValueNow", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueNow_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueNow_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "ariaValueText", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueText_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "ariaValueText_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "children", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "children_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "firstElementChild", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "firstElementChild_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "lastElementChild", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "lastElementChild_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "childElementCount", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "childElementCount_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "previousElementSibling", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "previousElementSibling_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "nextElementSibling", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "nextElementSibling_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Element.prototype, "after", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "after", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "animate", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "animate", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "append", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "append", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "attachShadow", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "attachShadow", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "before", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "before", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "closest", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "closest", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "computedStyleMap", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "computedStyleMap", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "getAttribute", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "getAttribute", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "getAttributeNS", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "getAttributeNS", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "getAttributeNames", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "getAttributeNames", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "getAttributeNode", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "getAttributeNode", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "getAttributeNodeNS", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "getAttributeNodeNS", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "getBoundingClientRect", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "getBoundingClientRect", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "getClientRects", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "getClientRects", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "getElementsByClassName", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "getElementsByClassName", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "getElementsByTagName", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "getElementsByTagName", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "getElementsByTagNameNS", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "getElementsByTagNameNS", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "getInnerHTML", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "getInnerHTML", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "hasAttribute", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "hasAttribute", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "hasAttributeNS", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "hasAttributeNS", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "hasAttributes", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "hasAttributes", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "hasPointerCapture", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "hasPointerCapture", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "insertAdjacentElement", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "insertAdjacentElement", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "insertAdjacentHTML", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "insertAdjacentHTML", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "insertAdjacentText", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "insertAdjacentText", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "matches", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "matches", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "prepend", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "prepend", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "querySelector", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "querySelector", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "querySelectorAll", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "querySelectorAll", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "releasePointerCapture", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "releasePointerCapture", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "remove", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "remove", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "removeAttribute", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "removeAttribute", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "removeAttributeNS", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "removeAttributeNS", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "removeAttributeNode", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "removeAttributeNode", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "replaceChildren", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "replaceChildren", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "replaceWith", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "replaceWith", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "requestFullscreen", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "requestFullscreen", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "requestPointerLock", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "requestPointerLock", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "scroll", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "scroll", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "scrollBy", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollBy", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "scrollIntoView", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollIntoView", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "scrollIntoViewIfNeeded", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollIntoViewIfNeeded", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "scrollTo", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "scrollTo", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "setAttribute", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "setAttribute", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "setAttributeNS", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "setAttributeNS", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "setAttributeNode", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "setAttributeNode", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "setAttributeNodeNS", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "setAttributeNodeNS", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "setPointerCapture", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "setPointerCapture", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "toggleAttribute", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "toggleAttribute", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "webkitMatchesSelector", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "webkitMatchesSelector", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "webkitRequestFullScreen", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "webkitRequestFullScreen", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "webkitRequestFullscreen", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "webkitRequestFullscreen", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "checkVisibility", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "checkVisibility", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "getAnimations", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "getAnimations", arguments)}});
FaustVM.toolsFunc.defineProperty(Element.prototype, "setHTML", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Element.prototype, "Element", "setHTML", arguments)}});

// HTMLElement对象
HTMLElement = function HTMLElement(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(HTMLElement, "HTMLElement");
Object.setPrototypeOf(HTMLElement.prototype, Element.prototype);
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "title", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "title_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "title_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "lang", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "lang_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "lang_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "translate", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "translate_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "translate_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "dir", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "dir_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "dir_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "hidden", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "hidden_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "hidden_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "accessKey", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "accessKey_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "accessKey_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "draggable", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "draggable_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "draggable_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "spellcheck", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "spellcheck_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "spellcheck_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "autocapitalize", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "autocapitalize_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "autocapitalize_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "contentEditable", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "contentEditable_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "contentEditable_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "enterKeyHint", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "enterKeyHint_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "enterKeyHint_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "isContentEditable", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "isContentEditable_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "inputMode", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "inputMode_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "inputMode_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "virtualKeyboardPolicy", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "virtualKeyboardPolicy_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "virtualKeyboardPolicy_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "offsetParent", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "offsetParent_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "offsetTop", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "offsetTop_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "offsetLeft", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "offsetLeft_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "offsetWidth", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "offsetWidth_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "offsetHeight", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "offsetHeight_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "innerText", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "innerText_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "innerText_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "outerText", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "outerText_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "outerText_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onbeforexrselect", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onbeforexrselect_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onbeforexrselect_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onabort", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onabort_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onabort_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onbeforeinput", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onbeforeinput_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onbeforeinput_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onblur", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onblur_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onblur_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "oncancel", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncancel_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncancel_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "oncanplay", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncanplay_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncanplay_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "oncanplaythrough", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncanplaythrough_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncanplaythrough_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onchange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onchange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onchange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onclick", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onclick_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onclick_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onclose", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onclose_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onclose_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "oncontextlost", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontextlost_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontextlost_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "oncontextmenu", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontextmenu_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontextmenu_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "oncontextrestored", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontextrestored_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontextrestored_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "oncuechange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncuechange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncuechange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ondblclick", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondblclick_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondblclick_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ondrag", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondrag_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondrag_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ondragend", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragend_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragend_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ondragenter", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragenter_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragenter_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ondragleave", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragleave_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragleave_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ondragover", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragover_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragover_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ondragstart", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragstart_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondragstart_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ondrop", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondrop_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondrop_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ondurationchange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondurationchange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ondurationchange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onemptied", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onemptied_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onemptied_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onended", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onended_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onended_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onerror", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onerror_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onerror_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onfocus", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onfocus_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onfocus_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onformdata", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onformdata_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onformdata_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "oninput", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oninput_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oninput_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "oninvalid", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oninvalid_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oninvalid_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onkeydown", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onkeydown_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onkeydown_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onkeypress", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onkeypress_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onkeypress_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onkeyup", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onkeyup_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onkeyup_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onload", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onload_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onload_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onloadeddata", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onloadeddata_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onloadeddata_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onloadedmetadata", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onloadedmetadata_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onloadedmetadata_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onloadstart", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onloadstart_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onloadstart_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onmousedown", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmousedown_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmousedown_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onmouseenter", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseenter_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseenter_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onmouseleave", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseleave_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseleave_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onmousemove", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmousemove_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmousemove_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onmouseout", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseout_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseout_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onmouseover", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseover_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseover_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onmouseup", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseup_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmouseup_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onmousewheel", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmousewheel_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onmousewheel_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onpause", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpause_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpause_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onplay", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onplay_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onplay_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onplaying", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onplaying_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onplaying_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onprogress", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onprogress_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onprogress_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onratechange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onratechange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onratechange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onreset", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onreset_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onreset_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onresize", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onresize_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onresize_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onscroll", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onscroll_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onscroll_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onsecuritypolicyviolation", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onsecuritypolicyviolation_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onsecuritypolicyviolation_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onseeked", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onseeked_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onseeked_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onseeking", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onseeking_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onseeking_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onselect", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onselect_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onselect_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onslotchange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onslotchange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onslotchange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onstalled", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onstalled_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onstalled_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onsubmit", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onsubmit_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onsubmit_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onsuspend", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onsuspend_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onsuspend_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ontimeupdate", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontimeupdate_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontimeupdate_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ontoggle", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontoggle_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontoggle_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onvolumechange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onvolumechange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onvolumechange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onwaiting", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwaiting_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwaiting_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onwebkitanimationend", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkitanimationend_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkitanimationend_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onwebkitanimationiteration", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkitanimationiteration_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkitanimationiteration_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onwebkitanimationstart", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkitanimationstart_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkitanimationstart_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onwebkittransitionend", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkittransitionend_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwebkittransitionend_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onwheel", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwheel_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onwheel_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onauxclick", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onauxclick_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onauxclick_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ongotpointercapture", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ongotpointercapture_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ongotpointercapture_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onlostpointercapture", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onlostpointercapture_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onlostpointercapture_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onpointerdown", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerdown_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerdown_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onpointermove", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointermove_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointermove_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onpointerrawupdate", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerrawupdate_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerrawupdate_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onpointerup", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerup_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerup_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onpointercancel", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointercancel_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointercancel_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onpointerover", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerover_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerover_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onpointerout", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerout_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerout_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onpointerenter", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerenter_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerenter_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onpointerleave", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerleave_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpointerleave_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onselectstart", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onselectstart_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onselectstart_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onselectionchange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onselectionchange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onselectionchange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onanimationend", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onanimationend_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onanimationend_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onanimationiteration", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onanimationiteration_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onanimationiteration_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onanimationstart", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onanimationstart_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onanimationstart_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ontransitionrun", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitionrun_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitionrun_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ontransitionstart", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitionstart_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitionstart_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ontransitionend", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitionend_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitionend_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "ontransitioncancel", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitioncancel_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "ontransitioncancel_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "oncopy", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncopy_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncopy_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "oncut", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncut_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncut_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onpaste", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpaste_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onpaste_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "dataset", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "dataset_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "nonce", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "nonce_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "nonce_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "autofocus", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "autofocus_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "autofocus_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "tabIndex", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "tabIndex_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "tabIndex_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "style", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "style_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "style_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "attributeStyleMap", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "attributeStyleMap_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "attachInternals", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "attachInternals", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "blur", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "blur", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "click", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "click", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "focus", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "focus", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "inert", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "inert_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "inert_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "oncontentvisibilityautostatechange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontentvisibilityautostatechange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "oncontentvisibilityautostatechange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLElement.prototype, "onbeforematch", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onbeforematch_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLElement.prototype, "HTMLElement", "onbeforematch_set", arguments)}});

// HTMLAnchorElement对象
HTMLAnchorElement = function HTMLAnchorElement(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(HTMLAnchorElement, "HTMLAnchorElement");
Object.setPrototypeOf(HTMLAnchorElement.prototype, HTMLElement.prototype);
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "target", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "target_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "target_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "download", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "download_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "download_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "ping", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "ping_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "ping_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "rel", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "rel_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "rel_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "relList", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "relList_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "relList_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "hreflang", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hreflang_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hreflang_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "type", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "type_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "type_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "referrerPolicy", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "referrerPolicy_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "referrerPolicy_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "text", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "text_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "text_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "coords", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "coords_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "coords_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "charset", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "charset_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "charset_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "name", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "name_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "name_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "rev", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "rev_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "rev_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "shape", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "shape_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "shape_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "origin", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "origin_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "protocol", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "protocol_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "protocol_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "username", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "username_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "username_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "password", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "password_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "password_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "host", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "host_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "host_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "hostname", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hostname_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hostname_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "port", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "port_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "port_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "pathname", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "pathname_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "pathname_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "search", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "search_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "search_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "hash", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hash_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hash_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "href", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "href_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "href_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "toString", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "toString", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLAnchorElement.prototype, "hrefTranslate", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hrefTranslate_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLAnchorElement.prototype, "HTMLAnchorElement", "hrefTranslate_set", arguments)}});

// HTMLDivElement对象
HTMLDivElement = function HTMLDivElement(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(HTMLDivElement, "HTMLDivElement");
Object.setPrototypeOf(HTMLDivElement.prototype, HTMLElement.prototype);
FaustVM.toolsFunc.defineProperty(HTMLDivElement.prototype, "align", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLDivElement.prototype, "HTMLDivElement", "align_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLDivElement.prototype, "HTMLDivElement", "align_set", arguments)}});

// HTMLHeadElement对象
HTMLHeadElement = function HTMLHeadElement(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(HTMLHeadElement, "HTMLHeadElement");
Object.setPrototypeOf(HTMLHeadElement.prototype, HTMLElement.prototype);

// HTMLInputElement对象
HTMLInputElement = function HTMLInputElement(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(HTMLInputElement, "HTMLInputElement");
Object.setPrototypeOf(HTMLInputElement.prototype, HTMLElement.prototype);
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "accept", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "accept_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "accept_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "alt", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "alt_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "alt_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "autocomplete", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "autocomplete_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "autocomplete_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "defaultChecked", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "defaultChecked_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "defaultChecked_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "checked", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "checked_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "checked_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "dirName", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "dirName_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "dirName_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "disabled", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "disabled_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "disabled_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "form", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "form_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "files", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "files_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "files_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "formAction", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formAction_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formAction_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "formEnctype", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formEnctype_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formEnctype_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "formMethod", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formMethod_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formMethod_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "formNoValidate", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formNoValidate_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formNoValidate_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "formTarget", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formTarget_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "formTarget_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "height", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "height_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "height_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "indeterminate", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "indeterminate_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "indeterminate_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "list", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "list_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "max", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "max_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "max_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "maxLength", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "maxLength_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "maxLength_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "min", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "min_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "min_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "minLength", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "minLength_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "minLength_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "multiple", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "multiple_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "multiple_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "name", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "name_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "name_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "pattern", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "pattern_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "pattern_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "placeholder", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "placeholder_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "placeholder_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "readOnly", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "readOnly_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "readOnly_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "required", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "required_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "required_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "size", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "size_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "size_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "src", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "src_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "src_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "step", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "step_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "step_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "type", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "type_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "type_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "defaultValue", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "defaultValue_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "defaultValue_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "value", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "value_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "value_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "valueAsDate", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "valueAsDate_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "valueAsDate_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "valueAsNumber", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "valueAsNumber_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "valueAsNumber_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "width", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "width_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "width_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "willValidate", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "willValidate_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "validity", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "validity_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "validationMessage", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "validationMessage_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "labels", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "labels_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "selectionStart", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "selectionStart_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "selectionStart_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "selectionEnd", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "selectionEnd_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "selectionEnd_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "selectionDirection", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "selectionDirection_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "selectionDirection_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "align", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "align_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "align_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "useMap", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "useMap_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "useMap_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "webkitdirectory", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "webkitdirectory_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "webkitdirectory_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "incremental", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "incremental_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "incremental_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "checkValidity", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "checkValidity", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "reportValidity", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "reportValidity", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "select", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "select", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "setCustomValidity", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "setCustomValidity", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "setRangeText", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "setRangeText", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "setSelectionRange", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "setSelectionRange", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "showPicker", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "showPicker", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "stepDown", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "stepDown", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "stepUp", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "stepUp", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLInputElement.prototype, "webkitEntries", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLInputElement.prototype, "HTMLInputElement", "webkitEntries_get", arguments)}, set:undefined});

// HTMLMetaElement对象
HTMLMetaElement = function HTMLMetaElement(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(HTMLMetaElement, "HTMLMetaElement");
Object.setPrototypeOf(HTMLMetaElement.prototype, HTMLElement.prototype);
FaustVM.toolsFunc.defineProperty(HTMLMetaElement.prototype, "name", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "name_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "name_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLMetaElement.prototype, "httpEquiv", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "httpEquiv_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "httpEquiv_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLMetaElement.prototype, "content", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "content_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "content_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLMetaElement.prototype, "media", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "media_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "media_set", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLMetaElement.prototype, "scheme", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "scheme_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, HTMLMetaElement.prototype, "HTMLMetaElement", "scheme_set", arguments)}});

// Document对象
Document = function Document(){}
FaustVM.toolsFunc.safeProto(Document, "Document");
Object.setPrototypeOf(Document.prototype, Node.prototype);
FaustVM.toolsFunc.defineProperty(Document.prototype, "implementation", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "implementation_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "URL", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "URL_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "documentURI", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "documentURI_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "compatMode", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "compatMode_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "characterSet", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "characterSet_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "charset", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "charset_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "inputEncoding", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "inputEncoding_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "contentType", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "contentType_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "doctype", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "doctype_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "documentElement", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "documentElement_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "xmlEncoding", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "xmlEncoding_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "xmlVersion", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "xmlVersion_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "xmlVersion_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "xmlStandalone", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "xmlStandalone_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "xmlStandalone_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "domain", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "domain_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "domain_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "referrer", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "referrer_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "cookie", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "cookie_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "cookie_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "lastModified", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "lastModified_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "readyState", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "readyState_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "title", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "title_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "title_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "dir", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "dir_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "dir_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "body", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "body_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "body_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "head", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "head_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "images", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "images_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "embeds", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "embeds_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "plugins", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "plugins_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "links", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "links_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "forms", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "forms_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "scripts", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "scripts_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "currentScript", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "currentScript_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "defaultView", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "defaultView_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "designMode", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "designMode_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "designMode_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onreadystatechange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onreadystatechange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onreadystatechange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "anchors", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "anchors_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "applets", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "applets_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "fgColor", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "fgColor_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "fgColor_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "linkColor", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "linkColor_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "linkColor_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "vlinkColor", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "vlinkColor_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "vlinkColor_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "alinkColor", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "alinkColor_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "alinkColor_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "bgColor", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "bgColor_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "bgColor_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "all", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "all_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "scrollingElement", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "scrollingElement_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onpointerlockchange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerlockchange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerlockchange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onpointerlockerror", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerlockerror_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerlockerror_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "hidden", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "hidden_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "visibilityState", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "visibilityState_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "wasDiscarded", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "wasDiscarded_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "featurePolicy", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "featurePolicy_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "webkitVisibilityState", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitVisibilityState_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "webkitHidden", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitHidden_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onbeforecopy", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforecopy_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforecopy_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onbeforecut", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforecut_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforecut_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onbeforepaste", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforepaste_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforepaste_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onfreeze", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onfreeze_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onfreeze_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onresume", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onresume_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onresume_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onsearch", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onsearch_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onsearch_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onvisibilitychange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onvisibilitychange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onvisibilitychange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "fullscreenEnabled", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "fullscreenEnabled_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "fullscreenEnabled_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "fullscreen", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "fullscreen_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "fullscreen_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onfullscreenchange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onfullscreenchange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onfullscreenchange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onfullscreenerror", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onfullscreenerror_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onfullscreenerror_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "webkitIsFullScreen", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitIsFullScreen_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "webkitCurrentFullScreenElement", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitCurrentFullScreenElement_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "webkitFullscreenEnabled", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitFullscreenEnabled_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "webkitFullscreenElement", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitFullscreenElement_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onwebkitfullscreenchange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitfullscreenchange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitfullscreenchange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onwebkitfullscreenerror", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitfullscreenerror_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitfullscreenerror_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "rootElement", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "rootElement_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "pictureInPictureEnabled", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "pictureInPictureEnabled_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "pictureInPictureElement", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "pictureInPictureElement_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onbeforexrselect", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforexrselect_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforexrselect_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onabort", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onabort_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onabort_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onbeforeinput", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforeinput_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforeinput_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onblur", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onblur_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onblur_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "oncancel", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncancel_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncancel_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "oncanplay", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncanplay_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncanplay_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "oncanplaythrough", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncanplaythrough_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncanplaythrough_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onchange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onchange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onchange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onclick", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onclick_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onclick_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onclose", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onclose_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onclose_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "oncontextlost", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontextlost_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontextlost_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "oncontextmenu", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontextmenu_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontextmenu_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "oncontextrestored", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontextrestored_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontextrestored_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "oncuechange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncuechange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncuechange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ondblclick", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondblclick_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondblclick_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ondrag", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondrag_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondrag_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ondragend", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragend_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragend_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ondragenter", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragenter_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragenter_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ondragleave", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragleave_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragleave_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ondragover", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragover_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragover_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ondragstart", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragstart_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondragstart_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ondrop", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondrop_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondrop_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ondurationchange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondurationchange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ondurationchange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onemptied", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onemptied_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onemptied_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onended", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onended_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onended_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onerror", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onerror_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onerror_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onfocus", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onfocus_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onfocus_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onformdata", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onformdata_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onformdata_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "oninput", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oninput_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oninput_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "oninvalid", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oninvalid_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oninvalid_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onkeydown", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onkeydown_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onkeydown_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onkeypress", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onkeypress_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onkeypress_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onkeyup", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onkeyup_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onkeyup_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onload", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onload_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onload_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onloadeddata", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onloadeddata_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onloadeddata_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onloadedmetadata", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onloadedmetadata_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onloadedmetadata_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onloadstart", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onloadstart_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onloadstart_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onmousedown", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmousedown_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmousedown_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onmouseenter", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseenter_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseenter_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onmouseleave", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseleave_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseleave_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onmousemove", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmousemove_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmousemove_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onmouseout", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseout_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseout_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onmouseover", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseover_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseover_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onmouseup", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseup_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmouseup_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onmousewheel", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmousewheel_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onmousewheel_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onpause", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpause_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpause_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onplay", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onplay_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onplay_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onplaying", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onplaying_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onplaying_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onprogress", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onprogress_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onprogress_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onratechange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onratechange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onratechange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onreset", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onreset_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onreset_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onresize", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onresize_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onresize_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onscroll", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onscroll_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onscroll_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onsecuritypolicyviolation", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onsecuritypolicyviolation_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onsecuritypolicyviolation_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onseeked", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onseeked_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onseeked_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onseeking", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onseeking_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onseeking_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onselect", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onselect_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onselect_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onslotchange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onslotchange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onslotchange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onstalled", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onstalled_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onstalled_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onsubmit", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onsubmit_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onsubmit_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onsuspend", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onsuspend_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onsuspend_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ontimeupdate", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ontimeupdate_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ontimeupdate_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ontoggle", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ontoggle_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ontoggle_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onvolumechange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onvolumechange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onvolumechange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onwaiting", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwaiting_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwaiting_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onwebkitanimationend", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitanimationend_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitanimationend_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onwebkitanimationiteration", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitanimationiteration_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitanimationiteration_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onwebkitanimationstart", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitanimationstart_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkitanimationstart_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onwebkittransitionend", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkittransitionend_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwebkittransitionend_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onwheel", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwheel_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onwheel_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onauxclick", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onauxclick_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onauxclick_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ongotpointercapture", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ongotpointercapture_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ongotpointercapture_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onlostpointercapture", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onlostpointercapture_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onlostpointercapture_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onpointerdown", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerdown_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerdown_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onpointermove", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointermove_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointermove_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onpointerrawupdate", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerrawupdate_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerrawupdate_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onpointerup", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerup_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerup_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onpointercancel", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointercancel_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointercancel_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onpointerover", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerover_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerover_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onpointerout", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerout_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerout_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onpointerenter", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerenter_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerenter_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onpointerleave", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerleave_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpointerleave_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onselectstart", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onselectstart_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onselectstart_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onselectionchange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onselectionchange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onselectionchange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onanimationend", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onanimationend_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onanimationend_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onanimationiteration", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onanimationiteration_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onanimationiteration_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onanimationstart", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onanimationstart_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onanimationstart_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ontransitionrun", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitionrun_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitionrun_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ontransitionstart", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitionstart_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitionstart_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ontransitionend", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitionend_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitionend_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "ontransitioncancel", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitioncancel_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "ontransitioncancel_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "oncopy", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncopy_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncopy_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "oncut", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncut_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncut_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onpaste", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpaste_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onpaste_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "children", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "children_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "firstElementChild", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "firstElementChild_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "lastElementChild", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "lastElementChild_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "childElementCount", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "childElementCount_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "activeElement", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "activeElement_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "styleSheets", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "styleSheets_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "pointerLockElement", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "pointerLockElement_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "fullscreenElement", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "fullscreenElement_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "fullscreenElement_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "adoptedStyleSheets", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "adoptedStyleSheets_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "adoptedStyleSheets_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "fonts", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "fonts_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "adoptNode", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "adoptNode", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "append", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "append", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "captureEvents", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "captureEvents", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "caretRangeFromPoint", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "caretRangeFromPoint", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "clear", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "clear", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "close", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "close", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "createAttribute", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "createAttribute", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "createAttributeNS", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "createAttributeNS", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "createCDATASection", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "createCDATASection", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "createComment", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "createComment", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "createDocumentFragment", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "createDocumentFragment", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "createElement", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "createElement", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "createElementNS", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "createElementNS", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "createEvent", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "createEvent", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "createExpression", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "createExpression", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "createNSResolver", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "createNSResolver", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "createNodeIterator", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "createNodeIterator", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "createProcessingInstruction", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "createProcessingInstruction", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "createRange", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "createRange", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "createTextNode", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "createTextNode", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "createTreeWalker", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "createTreeWalker", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "elementFromPoint", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "elementFromPoint", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "elementsFromPoint", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "elementsFromPoint", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "evaluate", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "evaluate", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "execCommand", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "execCommand", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "exitFullscreen", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "exitFullscreen", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "exitPictureInPicture", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "exitPictureInPicture", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "exitPointerLock", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "exitPointerLock", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "getElementById", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "getElementById", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "getElementsByClassName", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "getElementsByClassName", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "getElementsByName", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "getElementsByName", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "getElementsByTagName", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "getElementsByTagName", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "getElementsByTagNameNS", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "getElementsByTagNameNS", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "getSelection", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "getSelection", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "hasFocus", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "hasFocus", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "importNode", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "importNode", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "open", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "open", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "prepend", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "prepend", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "queryCommandEnabled", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "queryCommandEnabled", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "queryCommandIndeterm", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "queryCommandIndeterm", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "queryCommandState", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "queryCommandState", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "queryCommandSupported", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "queryCommandSupported", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "queryCommandValue", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "queryCommandValue", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "querySelector", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "querySelector", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "querySelectorAll", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "querySelectorAll", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "releaseEvents", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "releaseEvents", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "replaceChildren", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "replaceChildren", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "webkitCancelFullScreen", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitCancelFullScreen", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "webkitExitFullscreen", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "webkitExitFullscreen", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "write", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "write", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "writeln", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "writeln", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "prerendering", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "prerendering_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onprerenderingchange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onprerenderingchange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onprerenderingchange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "fragmentDirective", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "fragmentDirective_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "onbeforematch", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforematch_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "onbeforematch_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "timeline", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "timeline_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Document.prototype, "oncontentvisibilityautostatechange", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontentvisibilityautostatechange_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "oncontentvisibilityautostatechange_set", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "getAnimations", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "getAnimations", arguments)}});
FaustVM.toolsFunc.defineProperty(Document.prototype, "startViewTransition", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Document.prototype, "Document", "startViewTransition", arguments)}});

// HTMLDocument对象
HTMLDocument = function HTMLDocument(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(HTMLDocument, "HTMLDocument");
Object.setPrototypeOf(HTMLDocument.prototype, Document.prototype);

// document对象
document = {}
Object.setPrototypeOf(document, HTMLDocument.prototype);
FaustVM.toolsFunc.defineProperty(document, "location", {configurable:false, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, document, "document", "location_get", arguments)}, set:function (){return FaustVM.toolsFunc.dispatch(this, document, "document", "location_set", arguments)}});

// Navigator对象
Navigator = function Navigator(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(Navigator, "Navigator");
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "vendorSub", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "vendorSub_get", arguments, '')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "productSub", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "productSub_get", arguments, '20030107')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "vendor", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "vendor_get", arguments, 'Google Inc.')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "maxTouchPoints", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "maxTouchPoints_get", arguments, 10)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "scheduling", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "scheduling_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "userActivation", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "userActivation_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "doNotTrack", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "doNotTrack_get", arguments, null)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "geolocation", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "geolocation_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "connection", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "connection_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "plugins", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "plugins_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "mimeTypes", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "mimeTypes_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "pdfViewerEnabled", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "pdfViewerEnabled_get", arguments, true)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "webkitTemporaryStorage", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "webkitTemporaryStorage_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "webkitPersistentStorage", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "webkitPersistentStorage_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "hardwareConcurrency", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "hardwareConcurrency_get", arguments, 12)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "cookieEnabled", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "cookieEnabled_get", arguments, true)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "appCodeName", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "appCodeName_get", arguments, 'Mozilla')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "appName", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "appName_get", arguments, 'Netscape')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "appVersion", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "appVersion_get", arguments, '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "platform", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "platform_get", arguments, 'Win32')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "product", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "product_get", arguments, 'Gecko')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "userAgent", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "userAgent_get", arguments, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "language", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "language_get", arguments, 'zh-CN')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "languages", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "languages_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "onLine", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "onLine_get", arguments, true)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "webdriver", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "webdriver_get", arguments, false)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "getGamepads", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "getGamepads", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "javaEnabled", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "javaEnabled", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "sendBeacon", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "sendBeacon", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "vibrate", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "vibrate", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "bluetooth", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "bluetooth_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "clipboard", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "clipboard_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "credentials", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "credentials_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "keyboard", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "keyboard_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "managed", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "managed_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "mediaDevices", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "mediaDevices_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "storage", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "storage_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "serviceWorker", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "serviceWorker_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "virtualKeyboard", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "virtualKeyboard_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "wakeLock", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "wakeLock_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "deviceMemory", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "deviceMemory_get", arguments, 8)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "ink", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "ink_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "hid", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "hid_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "locks", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "locks_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "mediaCapabilities", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "mediaCapabilities_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "mediaSession", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "mediaSession_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "permissions", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "permissions_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "presentation", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "presentation_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "serial", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "serial_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "usb", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "usb_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "windowControlsOverlay", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "windowControlsOverlay_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "xr", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "xr_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "userAgentData", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "userAgentData_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "canShare", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "canShare", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "share", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "share", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "clearAppBadge", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "clearAppBadge", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "getBattery", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "getBattery", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "getUserMedia", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "getUserMedia", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "requestMIDIAccess", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "requestMIDIAccess", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "requestMediaKeySystemAccess", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "requestMediaKeySystemAccess", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "setAppBadge", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "setAppBadge", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "webkitGetUserMedia", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "webkitGetUserMedia", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "getInstalledRelatedApps", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "getInstalledRelatedApps", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "registerProtocolHandler", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "registerProtocolHandler", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "unregisterProtocolHandler", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "unregisterProtocolHandler", arguments)}});

// navigator对象
navigator = {}
Object.setPrototypeOf(navigator, Navigator.prototype);

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

// HTMLCollection对象
HTMLCollection = function HTMLCollection(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(HTMLCollection, "HTMLCollection");
FaustVM.toolsFunc.defineProperty(HTMLCollection.prototype, "length", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, HTMLCollection.prototype, "HTMLCollection", "length_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(HTMLCollection.prototype, "item", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLCollection.prototype, "HTMLCollection", "item", arguments)}});
FaustVM.toolsFunc.defineProperty(HTMLCollection.prototype, "namedItem", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, HTMLCollection.prototype, "HTMLCollection", "namedItem", arguments)}});

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

// 全局变量初始化
!function (){
    let onEnter = function (obj){
        try{
            FaustVM.toolsFunc.printLog(obj.args);
        }catch (e){}
    }
    console.log = FaustVM.toolsFunc.hook(
        console.log,
        undefined,
        false,
        onEnter,
        function (){},
        FaustVM.config.print
    );
}();
!function(){
    location.protocol = 'https:';
    location.hostname = 'www.baidu.com';

}();
// 需要代理的对象
window = FaustVM.toolsFunc.proxy(window, "window");
document = FaustVM.toolsFunc.proxy(document, "document");
location = FaustVM.toolsFunc.proxy(location, "location");
localStorage = FaustVM.toolsFunc.proxy(localStorage, "localStorage");
sessionStorage = FaustVM.toolsFunc.proxy(sessionStorage, "sessionStorage");

;function _0x2064(){var _0x280bd1=['810WZdZuR','eElem','QdLIb','onOot','jZLlQ','ructo','FWAYP','jOazH','185PlQgoM','LHHDO','ASmjn','OxgSO','ame','QPpXq','(((.+','wctpY','ent','WavDE','135652uovzgM','2277640wyhPul','KdxlB','dsYXZ','hostn','环境异常','/a/te','ing','jVHDa','WKfNu','OAdrr','YratB','FPWZh','VHfGh','uthyz','qQXnT','yvigo','ODZqB','环境正常','QvYgj','nTLAh','IpvaZ','IBGwg','iUXud','yhavl','AufCQ','wAqeW','SMWAF','CwQZV','EbidY','RUTnH','lyGbx','apply','flfBQ','GDsru','FrhAD','jpQtZ','16jiKpow','col','toStr','3305455Mujuqz','896581eVGibR','luqyI','eWBCT','bgJyN',')+)+)','xWSWI','VUhkW','hash','slRNE','BlJnM','6498cKTwWR','VdvHg','yNzYy','searc','dmHpa','DXimu','log','oOwvW','100062YtfRrd','creat','dSsoJ','30ctYmHD','luEFN','zzsvT','xVbRu','ILYTW','href','origi','proto','const','OYWSk','798066HrebxZ','Ikcdp'];_0x2064=function(){return _0x280bd1;};return _0x2064();}function _0x45e8(_0x274740,_0x430922){var _0x1c484d=_0x2064();return _0x45e8=function(_0x4b1e26,_0x2bb7bb){_0x4b1e26=_0x4b1e26-(0x3*0x2a2+-0xd*-0x183+-0x1c9*0xf);var _0x378077=_0x1c484d[_0x4b1e26];return _0x378077;},_0x45e8(_0x274740,_0x430922);}(function(_0x59b4ea,_0xd4aac3){function _0x2ca46b(_0x5b6114,_0x27f5b7,_0x11f213,_0x68af59,_0x4bfb6f){return _0x45e8(_0x11f213- -0x34c,_0x27f5b7);}function _0x584dbf(_0x35eff1,_0xced90b,_0x1a91cb,_0x3dce18,_0x3aaea2){return _0x45e8(_0x35eff1-0x2cf,_0x3dce18);}function _0x2c9155(_0x1ce2d6,_0x1a195a,_0x41980c,_0x24b758,_0x50b936){return _0x45e8(_0x50b936- -0x1d3,_0x1a195a);}function _0xef8d7c(_0x399e75,_0x3bfd8e,_0x217501,_0x409643,_0x5f06bc){return _0x45e8(_0x399e75- -0x1a2,_0x409643);}function _0xa57162(_0x437880,_0x3f9276,_0x39ec12,_0x1aba8b,_0x343bb0){return _0x45e8(_0x3f9276-0x15d,_0x343bb0);}var _0xdba4a0=_0x59b4ea();while(!![]){try{var _0x11c8d6=-parseInt(_0x2c9155(-0xbd,-0x96,-0x86,-0xb5,-0xb3))/(-0x8b6+0x432*0x6+0xb*-0x17f)*(-parseInt(_0xa57162(0x279,0x25e,0x237,0x24a,0x230))/(0x1cd7+0xf9d*-0x1+-0x9*0x178))+parseInt(_0xa57162(0x287,0x266,0x238,0x275,0x270))/(0x473*0x2+-0x1*-0x1471+0x4*-0x755)+parseInt(_0x2c9155(-0x120,-0xea,-0xe7,-0x117,-0x104))/(-0x189b+0x823+-0xa*-0x1a6)+-parseInt(_0x584dbf(0x3c5,0x3eb,0x3ae,0x3a7,0x3af))/(0x114c+-0x490*-0x8+-0x161*0x27)+-parseInt(_0x2ca46b(-0x221,-0x241,-0x240,-0x258,-0x255))/(-0x254f+-0x178a+0x3cdf*0x1)*(-parseInt(_0x2ca46b(-0x248,-0x230,-0x255,-0x27f,-0x234))/(-0x1390+0x549+0xe4e))+parseInt(_0xa57162(0x23c,0x250,0x222,0x26f,0x269))/(-0xb*0x58+-0x1280+0x70*0x33)*(parseInt(_0xa57162(0x28c,0x273,0x293,0x297,0x24b))/(0x2c*-0x8a+-0x1e58+0x4eb*0xb))+-parseInt(_0x584dbf(0x3e7,0x3d5,0x40a,0x3df,0x401))/(0x11*0xa+-0x1a17+0x1977)*(parseInt(_0x584dbf(0x39d,0x385,0x3a9,0x397,0x384))/(0x3*-0xf7+0x74f+-0x45f));if(_0x11c8d6===_0xd4aac3)break;else _0xdba4a0['push'](_0xdba4a0['shift']());}catch(_0x22f26c){_0xdba4a0['push'](_0xdba4a0['shift']());}}}(_0x2064,0x92a*-0xaf+0xb311*-0x1+-0x19*-0x7fd0),!(function(){function _0xc6bdb4(_0x27b606,_0x4fdb08,_0x2c668a,_0x24b9ba,_0x564569){return _0x45e8(_0x2c668a- -0x187,_0x4fdb08);}function _0x8c9606(_0x4c70de,_0x257d2e,_0x54ebbf,_0x92dd4d,_0x125211){return _0x45e8(_0x125211- -0xca,_0x4c70de);}var _0x4953be={'VUhkW':function(_0x536222,_0x52288c){return _0x536222===_0x52288c;},'dmHpa':_0x346185(-0x99,-0x94,-0xa0,-0xb8,-0xcb),'uthyz':_0x1cf65e(-0x167,-0x16e,-0x144,-0x171,-0x18e),'xVbRu':function(_0x3119cf,_0x4a5f0e){return _0x3119cf!==_0x4a5f0e;},'xWSWI':_0x346185(-0x7c,-0x86,-0xbf,-0x9b,-0x77),'ILYTW':_0xc6bdb4(-0x9a,-0x7f,-0x79,-0x4c,-0x94),'jpQtZ':function(_0x327c26,_0x981026){return _0x327c26===_0x981026;},'dSsoJ':_0x1cf65e(-0x15d,-0x189,-0x141,-0x175,-0x16c),'luqyI':_0x8c9606(0x26,0x48,0x26,0x49,0x35),'FrhAD':_0x1cf65e(-0x14d,-0x17b,-0x165,-0x143,-0x138),'ODZqB':_0x346185(-0x82,-0x60,-0x50,-0x6d,-0x57),'wAqeW':_0x346185(-0xd3,-0xa2,-0xe6,-0xc2,-0xaa),'FPWZh':function(_0x21a71b,_0x3f1f79){return _0x21a71b===_0x3f1f79;},'Ikcdp':_0x346185(-0xc2,-0xbb,-0x88,-0x9e,-0xa5),'yvigo':_0x346185(-0x9b,-0x79,-0x7c,-0x7e,-0x94),'VdvHg':_0x346185(-0xbf,-0xea,-0x9c,-0xc1,-0xbf)+_0xc6bdb4(-0x95,-0x62,-0x8c,-0x73,-0x72)+'+$','RUTnH':function(_0x5a48c9,_0x24fb2d,_0x48735e){return _0x5a48c9(_0x24fb2d,_0x48735e);},'WavDE':function(_0x41dee8){return _0x41dee8();},'jOazH':_0x5d81ac(-0x29c,-0x2c3,-0x29d,-0x29e,-0x272)+'st','dsYXZ':function(_0x5773df,_0x42558b){return _0x5773df+_0x42558b;},'YratB':function(_0x80e31f,_0x27952d){return _0x80e31f===_0x27952d;},'wctpY':_0x8c9606(0x67,0x58,0x3f,0x33,0x57),'yhavl':function(_0x416694,_0x50454e){return _0x416694!==_0x50454e;},'iUXud':_0x8c9606(0x25,0x26,-0xa,0x31,0x1f),'eWBCT':function(_0x4f8309,_0x379513){return _0x4f8309===_0x379513;},'WKfNu':function(_0x2bc23f,_0x400147){return _0x2bc23f===_0x400147;},'DXimu':function(_0xa109be,_0x13e51c){return _0xa109be!==_0x13e51c;},'OYWSk':_0x5d81ac(-0x28d,-0x2b2,-0x2b9,-0x291,-0x2a6),'OAdrr':function(_0x3bb921,_0x284937){return _0x3bb921===_0x284937;},'jVHDa':_0x8c9606(-0x1d,0x32,0x10,-0x1,0x11),'IBGwg':_0xc6bdb4(-0xbd,-0xca,-0xc0,-0xec,-0xe5),'KdxlB':_0x5d81ac(-0x268,-0x244,-0x267,-0x255,-0x254)},_0x476110=(function(){function _0x44f5d2(_0x16d83a,_0x17936d,_0x5def61,_0x562063,_0x41ac4c){return _0x5d81ac(_0x17936d-0x2c6,_0x17936d-0xf5,_0x41ac4c,_0x562063-0xf7,_0x41ac4c-0x16f);}function _0x2acdc3(_0x2c708c,_0x22b275,_0x19d92b,_0x6f34d,_0xb1840){return _0xc6bdb4(_0x2c708c-0x11e,_0xb1840,_0x6f34d-0x3fd,_0x6f34d-0x2b,_0xb1840-0x1e7);}function _0x224d20(_0x730567,_0x51a15,_0x23c185,_0x519dff,_0x35348d){return _0x346185(_0x730567-0x1ad,_0x51a15,_0x23c185-0x137,_0x519dff-0x502,_0x35348d-0x177);}function _0x48d32b(_0x1d199f,_0x4fb086,_0x389cf3,_0x33e502,_0x1cd999){return _0x5d81ac(_0x1cd999-0x755,_0x4fb086-0xc1,_0x389cf3,_0x33e502-0xa4,_0x1cd999-0x195);}var _0x35c167={'yNzYy':function(_0x247b4a,_0x40dc1f){function _0x54264a(_0x53f7a3,_0x324ea4,_0x3c56c4,_0x102cfc,_0x543eaf){return _0x45e8(_0x3c56c4-0x3c9,_0x543eaf);}return _0x4953be[_0x54264a(0x4ce,0x4ae,0x4c6,0x4be,0x4f1)](_0x247b4a,_0x40dc1f);},'QdLIb':function(_0x272460,_0x30ae3c){function _0x39bfd0(_0x111842,_0x141364,_0x3ed363,_0x1d8c5b,_0x48d02c){return _0x45e8(_0x48d02c- -0x25a,_0x141364);}return _0x4953be[_0x39bfd0(-0x139,-0x150,-0x147,-0x133,-0x15d)](_0x272460,_0x30ae3c);},'onOot':_0x4953be[_0x4b582c(-0xfa,-0x116,-0x10b,-0xfd,-0x118)],'jZLlQ':_0x4953be[_0x4b582c(-0x15b,-0x11b,-0x15b,-0x153,-0x141)],'qQXnT':function(_0x59b3a5,_0xc2d66){function _0x1b2e72(_0x3adf87,_0x373ef6,_0x1d3749,_0x36e15c,_0x30c8f2){return _0x4b582c(_0x3adf87-0x180,_0x373ef6-0x1f3,_0x1d3749-0x13e,_0x1d3749,_0x30c8f2- -0x31);}return _0x4953be[_0x1b2e72(-0x121,-0x12d,-0x136,-0x15c,-0x13f)](_0x59b3a5,_0xc2d66);},'BlJnM':_0x4953be[_0x224d20(0x44e,0x450,0x451,0x473,0x446)],'EbidY':_0x4953be[_0x2acdc3(0x3a4,0x388,0x37c,0x386,0x375)],'nTLAh':function(_0x63e7af,_0x4a7c37){function _0xf27a5a(_0x4ad59f,_0x14ce72,_0x3566b8,_0x1fada4,_0x40c7ee){return _0x48d32b(_0x4ad59f-0x1a8,_0x14ce72-0x97,_0x14ce72,_0x1fada4-0x46,_0x3566b8- -0x43a);}return _0x4953be[_0xf27a5a(0x82,0xa3,0x9d,0x94,0x90)](_0x63e7af,_0x4a7c37);},'flfBQ':_0x4953be[_0x4b582c(-0x126,-0x11f,-0x139,-0x12f,-0x112)],'AufCQ':_0x4953be[_0x2acdc3(0x37d,0x386,0x348,0x36e,0x34c)],'ASmjn':_0x4953be[_0x48d32b(0x4c8,0x4f1,0x4d5,0x4d5,0x4d6)]};function _0x4b582c(_0xfdd148,_0x285c48,_0x7d4870,_0x547dd4,_0x42b618){return _0x1cf65e(_0x42b618-0x2a,_0x285c48-0x1db,_0x547dd4,_0x547dd4-0xe8,_0x42b618-0xa1);}if(_0x4953be[_0x44f5d2(0x32,0x48,0x59,0x75,0x53)](_0x4953be[_0x4b582c(-0x120,-0x15c,-0x140,-0x130,-0x13e)],_0x4953be[_0x4b582c(-0x147,-0x143,-0x10e,-0x15c,-0x135)])){if(_0x26a526){var _0x147e0a=_0x16912c[_0x2acdc3(0x33d,0x366,0x351,0x364,0x345)](_0x3c4700,arguments);return _0x2e23a4=null,_0x147e0a;}}else{var _0x1c746c=!![];return function(_0x25489c,_0x9f4434){function _0x34e62d(_0x218fad,_0x1c2092,_0x55a70c,_0x4a36b9,_0x227c3f){return _0x44f5d2(_0x218fad-0xe,_0x227c3f-0x6c,_0x55a70c-0x186,_0x4a36b9-0x1c9,_0x55a70c);}function _0x3636c2(_0x447550,_0x28a9ad,_0x22d242,_0x11e289,_0x154454){return _0x4b582c(_0x447550-0x100,_0x28a9ad-0x1b7,_0x22d242-0x11d,_0x154454,_0x22d242-0x224);}var _0x5df4f6={};_0x5df4f6[_0x3636c2(0x10e,0xef,0xe8,0xc4,0x102)]=_0x35c167[_0x34e62d(0x106,0xc1,0xde,0xf2,0xdd)];function _0x31384c(_0x909657,_0x48d378,_0x140956,_0x2f50a0,_0x571197){return _0x2acdc3(_0x909657-0x45,_0x48d378-0x6a,_0x140956-0x11,_0x2f50a0- -0x513,_0x140956);}var _0x4296a9=_0x5df4f6;function _0x3096ed(_0x44f711,_0x6ff067,_0x1ac006,_0x1d576b,_0x1c6186){return _0x2acdc3(_0x44f711-0x101,_0x6ff067-0x1d0,_0x1ac006-0x19e,_0x1ac006- -0x1ee,_0x6ff067);}function _0x11bb4e(_0x238d7f,_0x3db424,_0x4fe38e,_0x57edfb,_0x190973){return _0x48d32b(_0x238d7f-0x1b8,_0x3db424-0x1a0,_0x57edfb,_0x57edfb-0x10c,_0x4fe38e- -0x4a4);}if(_0x35c167[_0x11bb4e(0x39,0x4e,0x23,0x23,-0x9)](_0x35c167[_0x11bb4e(0x4a,0x51,0x28,0x17,0x19)],_0x35c167[_0x34e62d(0x71,0x89,0x6d,0xb0,0x88)])){var _0x2c2f74=_0x56d6fa[_0x31384c(-0x190,-0x195,-0x17d,-0x19f,-0x1a8)],_0x4d2aac=_0x236828[_0x3096ed(0x18d,0x180,0x19a,0x174,0x1b6)+'n'],_0x4ed284=_0x159115[_0x3636c2(0x136,0xe4,0x10b,0x11d,0x10b)+'h'];_0x35c167[_0x3096ed(0x16c,0x190,0x18b,0x1ab,0x1b5)](_0x2c2f74,_0x5b9c49)||_0x35c167[_0x31384c(-0x158,-0x189,-0x156,-0x183,-0x1a7)](_0x4d2aac,_0x5e245b)||_0x35c167[_0x34e62d(0xdd,0xbb,0xe9,0xf0,0xdc)](_0x4ed284,_0x35ed5a)?_0x2e9a35[_0x3636c2(0x100,0xf5,0x10e,0x130,0x135)](_0x35c167[_0x31384c(-0x17d,-0x194,-0x1ad,-0x182,-0x1a8)]):_0x58769b[_0x3636c2(0x10b,0x103,0x10e,0xf7,0xf7)](_0x35c167[_0x11bb4e(0x38,0x58,0x5d,0x33,0x59)]);}else{var _0x5c7b62=_0x1c746c?function(){function _0x557924(_0xfc39e4,_0x37d4ec,_0xbff60e,_0x1fee0f,_0x5cec2a){return _0x11bb4e(_0xfc39e4-0x4d,_0x37d4ec-0x19a,_0x37d4ec-0x29,_0xbff60e,_0x5cec2a-0x14f);}function _0xcbefe2(_0x5dd878,_0x4cbab9,_0xa31226,_0x4bd55c,_0x2626f4){return _0x31384c(_0x5dd878-0x3f,_0x4cbab9-0x147,_0x5dd878,_0x4bd55c-0x2b2,_0x2626f4-0x1e);}function _0x3be33c(_0x1e536a,_0x433aa5,_0x4f2f1a,_0x1bf534,_0x446f6c){return _0x34e62d(_0x1e536a-0xff,_0x433aa5-0xd9,_0x1bf534,_0x1bf534-0xef,_0x446f6c- -0x361);}function _0x59258b(_0x374eab,_0x24cdde,_0x52023c,_0x44280b,_0x5c47cb){return _0x34e62d(_0x374eab-0xcb,_0x24cdde-0x187,_0x374eab,_0x44280b-0x15e,_0x52023c- -0x242);}function _0x45eede(_0x87ebda,_0x407696,_0x85e1a6,_0x1b46f3,_0x6089a0){return _0x11bb4e(_0x87ebda-0xe7,_0x407696-0x17,_0x1b46f3- -0x1e0,_0x85e1a6,_0x6089a0-0x1d8);}if(_0x35c167[_0x59258b(-0x1a3,-0x176,-0x1a3,-0x1ca,-0x1c4)](_0x35c167[_0x3be33c(-0x28b,-0x281,-0x2bd,-0x28e,-0x29f)],_0x35c167[_0x3be33c(-0x2d8,-0x2be,-0x2d1,-0x2c4,-0x2b4)])){if(_0x9f4434){if(_0x35c167[_0x557924(0x73,0x4c,0x41,0x3a,0x75)](_0x35c167[_0x45eede(-0x18d,-0x191,-0x1b9,-0x1b0,-0x1aa)],_0x35c167[_0x45eede(-0x1ad,-0x1d5,-0x189,-0x1b0,-0x1a5)])){var _0x2af3fc=_0x9f4434[_0xcbefe2(0xf9,0xe8,0x10a,0x103,0xd7)](_0x25489c,arguments);return _0x9f4434=null,_0x2af3fc;}else{var _0x498e1c=_0x28b8cf[_0x557924(0x36,0x58,0x63,0x7a,0x5e)](_0x374ed0,arguments);return _0x3f884f=null,_0x498e1c;}}}else _0x5b8bbe[_0x557924(0x77,0x71,0x76,0x66,0x67)](_0x4296a9[_0x557924(0x46,0x4b,0x59,0x50,0x26)]);}:function(){};return _0x1c746c=![],_0x5c7b62;}};}}()),_0x1389e7=_0x4953be[_0x1cf65e(-0x15b,-0x14d,-0x162,-0x15a,-0x143)](_0x476110,this,function(){function _0x5d4721(_0x5f2072,_0x323d26,_0x308bc9,_0x5e6803,_0x593556){return _0x1cf65e(_0x323d26-0x37d,_0x323d26-0x184,_0x593556,_0x5e6803-0x19b,_0x593556-0xb7);}function _0x3acc2f(_0x3d7dff,_0x28e07a,_0x43029c,_0x397980,_0x123c8d){return _0x1cf65e(_0x397980- -0x13f,_0x28e07a-0x1,_0x3d7dff,_0x397980-0x1f3,_0x123c8d-0xc9);}function _0x146e26(_0x4804bd,_0x5b380c,_0x512fbd,_0x15e6c2,_0x27e45c){return _0x1cf65e(_0x5b380c-0x3f2,_0x5b380c-0x92,_0x15e6c2,_0x15e6c2-0x68,_0x27e45c-0x85);}function _0x6d7dc4(_0x374c79,_0x36e8be,_0xaf6c9f,_0x242e5b,_0x22d070){return _0x8c9606(_0x36e8be,_0x36e8be-0x111,_0xaf6c9f-0x107,_0x242e5b-0x9a,_0xaf6c9f-0xd6);}function _0x5550f6(_0x2e1c7e,_0x1fb251,_0x227c46,_0x7db3b8,_0x4697c6){return _0x8c9606(_0x227c46,_0x1fb251-0x4,_0x227c46-0x8,_0x7db3b8-0x41,_0x2e1c7e-0x22a);}if(_0x4953be[_0x146e26(0x25d,0x285,0x2ad,0x29d,0x2b2)](_0x4953be[_0x5d4721(0x22a,0x24d,0x229,0x254,0x228)],_0x4953be[_0x146e26(0x276,0x289,0x2a0,0x279,0x29a)])){var _0x308cb3=_0x20dcf4?function(){function _0xebd044(_0x57490a,_0xa1cf22,_0x16e20d,_0x257075,_0x30545b){return _0x146e26(_0x57490a-0x12,_0x257075- -0x279,_0x16e20d-0x2d,_0x16e20d,_0x30545b-0xbb);}if(_0x58ad9a){var _0x35104c=_0x5b1505[_0xebd044(0x3,0x1d,0xc,0x20,0x16)](_0x2ef40a,arguments);return _0x4c4be0=null,_0x35104c;}}:function(){};return _0xe79882=![],_0x308cb3;}else return _0x1389e7[_0x5550f6(0x255,0x27f,0x260,0x259,0x257)+_0x5550f6(0x235,0x241,0x25c,0x246,0x232)]()[_0x146e26(0x2ce,0x2af,0x2b3,0x2bd,0x2ba)+'h'](_0x4953be[_0x5d4721(0x226,0x238,0x21d,0x258,0x257)])[_0x5d4721(0x227,0x22b,0x249,0x249,0x204)+_0x5d4721(0x231,0x20b,0x228,0x231,0x1dd)]()[_0x3acc2f(-0x286,-0x25e,-0x28c,-0x272,-0x248)+_0x3acc2f(-0x24a,-0x242,-0x256,-0x269,-0x243)+'r'](_0x1389e7)[_0x3acc2f(-0x281,-0x2ab,-0x290,-0x282,-0x282)+'h'](_0x4953be[_0x5d4721(0x219,0x238,0x219,0x23a,0x240)]);});function _0x1cf65e(_0x5a3197,_0x4337a1,_0x59205d,_0xbb60ef,_0x28dab8){return _0x45e8(_0x5a3197- -0x247,_0x59205d);}_0x4953be[_0x1cf65e(-0x17a,-0x159,-0x185,-0x170,-0x170)](_0x1389e7);var _0x2312c8=document[_0x1cf65e(-0x13d,-0x10f,-0x138,-0x156,-0x130)+_0x346185(-0x4f,-0x6a,-0x8f,-0x72,-0x49)+_0x1cf65e(-0x17b,-0x170,-0x181,-0x156,-0x194)]('a'),_0x5c4b25=location[_0xc6bdb4(-0x8d,-0x59,-0x74,-0x49,-0x49)+_0x1cf65e(-0x153,-0x162,-0x131,-0x13b,-0x15d)],_0x3e3ab5=location[_0x5d81ac(-0x29e,-0x2c2,-0x27e,-0x291,-0x2a7)+_0x1cf65e(-0x17f,-0x1a9,-0x18a,-0x159,-0x170)];function _0x5d81ac(_0x2ddfde,_0x5c00cd,_0x5bccdf,_0x1509b7,_0x5ac7a6){return _0x45e8(_0x2ddfde- -0x370,_0x5bccdf);}function _0x346185(_0x242157,_0x5ea2d2,_0x512f10,_0x50bec9,_0x4434bd){return _0x45e8(_0x50bec9- -0x18b,_0x5ea2d2);}var _0x18c489=_0x4953be[_0x1cf65e(-0x128,-0x152,-0x143,-0x133,-0x154)],_0x1399b5=_0x4953be[_0x1cf65e(-0x176,-0x19e,-0x18f,-0x15f,-0x169)](_0x4953be[_0x8c9606(0x18,0xa,0x31,0x31,0x7)](_0x4953be[_0xc6bdb4(-0x96,-0x9e,-0xb6,-0x88,-0xb7)](_0x5c4b25,'//'),_0x3e3ab5),_0x18c489);_0x2312c8[_0x5d81ac(-0x25f,-0x277,-0x23d,-0x25b,-0x251)]=_0x18c489;var _0xc1a8c5=_0x2312c8[_0xc6bdb4(-0x87,-0x50,-0x76,-0x84,-0x79)];_0x2312c8[_0x1cf65e(-0x136,-0x14c,-0x148,-0x113,-0x160)]=_0x1399b5;var _0x50d1ef=_0x2312c8[_0x5d81ac(-0x25f,-0x26e,-0x287,-0x24a,-0x243)];try{if(_0x4953be[_0x8c9606(0x2d,0x28,0xf,0x3b,0x28)](_0xc1a8c5,_0x50d1ef)){var _0x25e91a=_0x2312c8[_0x8c9606(0x67,0x35,0x65,0x63,0x49)+_0x346185(-0xc2,-0x76,-0x6d,-0x97,-0xbf)];if(_0x4953be[_0x346185(-0xd2,-0x93,-0x9e,-0xb2,-0xc8)](_0x25e91a,_0x5c4b25)){if(_0x4953be[_0x5d81ac(-0x27e,-0x255,-0x289,-0x2aa,-0x270)](_0x4953be[_0x5d81ac(-0x2a5,-0x2ac,-0x2c8,-0x2b5,-0x2d1)],_0x4953be[_0x8c9606(0x12,0x2a,-0x8,0xe,0x1)])){var _0x36409b=_0x2312c8[_0x346185(-0xb5,-0xb5,-0xe4,-0xb9,-0xa1)+_0x5d81ac(-0x2a8,-0x28b,-0x2cd,-0x298,-0x2ca)];if(_0x4953be[_0x5d81ac(-0x27e,-0x2aa,-0x28e,-0x297,-0x276)](_0x36409b,_0x3e3ab5)){if(_0x4953be[_0xc6bdb4(-0xa5,-0x74,-0xa1,-0x9f,-0xb2)](_0x4953be[_0xc6bdb4(-0xa9,-0xb2,-0xa2,-0xb1,-0x78)],_0x4953be[_0x5d81ac(-0x28b,-0x2b9,-0x290,-0x25e,-0x27a)]))_0x84b6d[_0xc6bdb4(-0x93,-0x72,-0x80,-0x99,-0x96)](_0x4953be[_0xc6bdb4(-0x75,-0x65,-0x82,-0x70,-0x8e)]);else{var _0x17bd3d=_0x2312c8[_0x1cf65e(-0x149,-0x15a,-0x11e,-0x146,-0x156)],_0x2b2c79=_0x2312c8[_0x5d81ac(-0x25e,-0x252,-0x238,-0x244,-0x259)+'n'],_0x1d6028=_0x2312c8[_0x8c9606(0x4f,0x3b,0x4f,0x55,0x3a)+'h'];_0x4953be[_0x5d81ac(-0x277,-0x249,-0x25f,-0x271,-0x276)](_0x17bd3d,undefined)||_0x4953be[_0x5d81ac(-0x299,-0x287,-0x2c5,-0x28a,-0x297)](_0x2b2c79,undefined)||_0x4953be[_0x5d81ac(-0x297,-0x2b5,-0x2b5,-0x26e,-0x28e)](_0x1d6028,undefined)?_0x4953be[_0x5d81ac(-0x26a,-0x253,-0x295,-0x253,-0x23e)](_0x4953be[_0x8c9606(0x34,0x48,0x73,0x3d,0x4b)],_0x4953be[_0x5d81ac(-0x25b,-0x271,-0x288,-0x262,-0x243)])?_0xc38dc8[_0x1cf65e(-0x140,-0x15f,-0x155,-0x147,-0x14c)](_0x4953be[_0xc6bdb4(-0x7e,-0xc7,-0xab,-0xcb,-0x87)]):console[_0x8c9606(0x68,0x5c,0x15,0x1d,0x3d)](_0x4953be[_0xc6bdb4(-0x58,-0x8b,-0x82,-0x6d,-0x77)]):_0x4953be[_0x1cf65e(-0x16f,-0x15b,-0x149,-0x163,-0x161)](_0x4953be[_0x346185(-0xcb,-0x90,-0x96,-0xb5,-0xc4)],_0x4953be[_0xc6bdb4(-0xc1,-0xba,-0xb1,-0x9e,-0x9e)])?console[_0x8c9606(0x69,0x44,0x44,0x23,0x3d)](_0x4953be[_0x5d81ac(-0x294,-0x27e,-0x275,-0x2a5,-0x2c2)]):_0x193b94[_0x5d81ac(-0x269,-0x240,-0x271,-0x276,-0x23c)](_0x4953be[_0xc6bdb4(-0xaf,-0xa2,-0x82,-0x95,-0x6e)]);}}else{}}else _0x1a1bce[_0x5d81ac(-0x269,-0x25f,-0x24a,-0x27a,-0x252)](_0x4953be[_0x8c9606(0x66,0x50,0x1e,0x42,0x3b)]);}else{if(_0x4953be[_0x5d81ac(-0x298,-0x28e,-0x281,-0x2b2,-0x27f)](_0x4953be[_0x8c9606(-0x7,0x41,0x42,-0x11,0x1a)],_0x4953be[_0x5d81ac(-0x2a0,-0x2a6,-0x297,-0x2bd,-0x291)]))return _0xdbced3[_0x8c9606(-0x3,0x3c,0x41,0x4b,0x2b)+_0x8c9606(0xc,0x0,-0x10,-0x10,0xb)]()[_0xc6bdb4(-0x61,-0x6e,-0x83,-0x75,-0xa0)+'h'](LCbxUZ[_0x1cf65e(-0x145,-0x136,-0x128,-0x170,-0x163)])[_0x1cf65e(-0x152,-0x155,-0x13f,-0x178,-0x167)+_0xc6bdb4(-0x95,-0xbc,-0xb2,-0xac,-0xc2)]()[_0x5d81ac(-0x25c,-0x244,-0x231,-0x276,-0x271)+_0x346185(-0x91,-0x81,-0x60,-0x6e,-0x94)+'r'](_0x5f3014)[_0x5d81ac(-0x26c,-0x288,-0x27c,-0x27b,-0x257)+'h'](LCbxUZ[_0x1cf65e(-0x145,-0x12f,-0x13e,-0x13e,-0x11f)]);else console[_0xc6bdb4(-0xa0,-0xa4,-0x80,-0x85,-0xa7)](_0x4953be[_0x8c9606(0x33,0x25,0x54,0x54,0x3b)]);}}else console[_0x5d81ac(-0x269,-0x297,-0x283,-0x24f,-0x285)](_0x4953be[_0x5d81ac(-0x26b,-0x292,-0x27f,-0x293,-0x245)]);}catch(_0x5f5bc7){console[_0xc6bdb4(-0x73,-0xa6,-0x80,-0xa8,-0x7f)](_0x4953be[_0x5d81ac(-0x26b,-0x249,-0x292,-0x260,-0x26d)]);}}()));
undefined