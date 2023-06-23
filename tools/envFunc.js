// 浏览器接口具体的实现
!function (){
    FaustVM.envFunc.Document_all_get = function Document_all_get(){
        let all = FaustVM.memory.globalVar.all;
        Object.setPrototypeOf(all, HTMLAllCollection.prototype);
        return all;
    }
    FaustVM.envFunc.Event_timeStamp_get = function Event_timeStamp_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "timeStamp");
    }
    FaustVM.envFunc.MouseEvent_clientY_get = function MouseEvent_clientY_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "clientY");
    }
    FaustVM.envFunc.MouseEvent_clientX_get = function MouseEvent_clientX_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "clientX");
    }
    FaustVM.envFunc.EventTarget_addEventListener = function EventTarget_addEventListener(){
        let type = arguments[0];
        let listener = arguments[1];
        let options = arguments[2];
        let event = {
            "self": this,
            "type": type,
            "listener":listener,
            "options":options
        }
        if(FaustVM.memory.asyncEvent.listener === undefined){
            FaustVM.memory.asyncEvent.listener = {};
        }
        if(FaustVM.memory.asyncEvent.listener[type] === undefined){
           FaustVM.memory.asyncEvent.listener[type] = [];
        }
        FaustVM.memory.asyncEvent.listener[type].push(event);
    }
    FaustVM.envFunc.BatteryManager_level_get = function BatteryManager_level_get(){
        return 1;
    }
    FaustVM.envFunc.BatteryManager_chargingTime_get = function BatteryManager_chargingTime_get(){
        return 0;
    }
    FaustVM.envFunc.BatteryManager_charging_get = function BatteryManager_charging_get(){
        return true;
    }
    FaustVM.envFunc.Navigator_getBattery = function Navigator_getBattery(){
        let batteryManager = {};
        batteryManager = FaustVM.toolsFunc.createProxyObj(batteryManager, BatteryManager, "batteryManager");
        let obj = {
            "then":function (callBack){
                let _callBack = callBack;
                callBack = function (){
                    return _callBack(batteryManager);
                }
                if(FaustVM.memory.asyncEvent.promise === undefined){
                    FaustVM.memory.asyncEvent.promise = [];
                }
                FaustVM.memory.asyncEvent.promise.push(callBack);
            }
        }
        return obj;
    }
    FaustVM.envFunc.window_clearTimeout = function window_clearTimeout(){
        let timeoutID = arguments[0];
        for(let i = 0; i< FaustVM.memory.asyncEvent.setTimeout.length;i++){
            let event = FaustVM.memory.asyncEvent.setTimeout[i];
            if(event.timeoutID === timeoutID){
                delete FaustVM.memory.asyncEvent.setTimeout[i];
            }
        }
    }
    FaustVM.envFunc.window_setTimeout = function window_setTimeout(){
        let func = arguments[0];
        let delay = arguments[1] || 0;
        let length = arguments.length;
        let args = [];
        for(let i=2;i<length;i++){
            args.push(arguments[i]);
        }
        let type = 1;
        if(typeof func !== "function"){
            type = 0;
        }
        FaustVM.memory.globalVar.timeoutID += 1;
        let event = {
            "callback":func,
            "delay":delay,
            "args":args,
            "type":type, // 1代表函数，0代表是字符串代码,eval(code);
            "timeoutID": FaustVM.memory.globalVar.timeoutID
        }
        if(FaustVM.memory.asyncEvent.setTimeout === undefined){
            FaustVM.memory.asyncEvent.setTimeout = [];
        }
        FaustVM.memory.asyncEvent.setTimeout.push(event);
        return FaustVM.memory.globalVar.timeoutID;
    }
    FaustVM.envFunc.XMLHttpRequest_open = function XMLHttpRequest_open(){
        // 浏览器接口
        let method = arguments[0];
        let url = arguments[1];
        return url;
    }
    FaustVM.envFunc.HTMLElement_offsetHeight_get = function HTMLElement_offsetHeight_get(){
        debugger;
        let fontFamily = this.style.fontFamily;
        if(FaustVM.memory.globalVar.fontList.indexOf(fontFamily) !== -1){// 能够识别的字体
            return 666;
        }else{ // 无法识别的字体
            return 999;
        }
    }
    FaustVM.envFunc.HTMLElement_offsetWidth_get = function HTMLElement_offsetWidth_get(){
        let fontFamily = this.style.fontFamily;
        if(FaustVM.memory.globalVar.fontList.indexOf(fontFamily) !== -1){// 能够识别的字体
            return 1666;
        }else{ // 无法识别的字体
            return 1999;
        }
    }
    FaustVM.envFunc.Element_children_get = function Element_children_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "children");
    }
    FaustVM.envFunc.Node_appendChild = function Node_appendChild(){
        let tag = arguments[0];
        let collection = [];
        collection.push(tag);
        collection = FaustVM.toolsFunc.createProxyObj(collection, HTMLCollection, "collection");
        FaustVM.toolsFunc.setProtoArr.call(this, "children", collection);
        return tag;
    }
    FaustVM.envFunc.Document_body_get = function Document_body_get(){
        let collection = FaustVM.toolsFunc.getCollection('[object HTMLBodyElement]');
        return collection[0];
    }
    FaustVM.envFunc.Element_innerHTML_set = function Element_innerHTML_set(){
        let htmlStr = arguments[0];
        // <span lang="zh" style="font-family:mmll;font-size:160px">fontTest</span>
        let style = {
            "font-size":"160px",
            "font-family":"mmll",
            "fontFamily":"mmll"
        };
        style = FaustVM.toolsFunc.createProxyObj(style,CSSStyleDeclaration, "style");
        let tagJson = {
            "type": "span",
            "prop":{
                "lang":"zh",
                "style":style,
                "textContent":"fontTest"
            }
        }
        let span = document.createElement(tagJson["type"]);
        for (const key in tagJson["prop"]) {
            FaustVM.toolsFunc.setProtoArr.call(span, key, tagJson["prop"][key]);
        }
        let collection = [];
        collection.push(span);
        collection = FaustVM.toolsFunc.createProxyObj(collection, HTMLCollection, "collection");
        FaustVM.toolsFunc.setProtoArr.call(this, "children", collection);
    }
    FaustVM.envFunc.WebGLRenderingContext_canvas_get = function WebGLRenderingContext_canvas_get(){
        return FaustVM.toolsFunc.getProtoArr.call(this, "canvas");
    }
    FaustVM.envFunc.WebGLRenderingContext_createProgram = function WebGLRenderingContext_createProgram(){
        let program = {};
        program = FaustVM.toolsFunc.createProxyObj(program, WebGLProgram, "program");
        return program;
    }
    FaustVM.envFunc.WebGLRenderingContext_createBuffer = function WebGLRenderingContext_createBuffer(){
        let buffer = {};
        buffer = FaustVM.toolsFunc.createProxyObj(buffer, WebGLBuffer, "buffer");
        return buffer;
    }
    FaustVM.envFunc.HTMLCanvasElement_toDataURL = function HTMLCanvasElement_toDataURL(){
        let type = FaustVM.toolsFunc.getProtoArr.call(this, "type");
        if(type === "2d"){
            return FaustVM.memory.globalVar.canvas_2d;
        }else if(type === "webgl"){
            return FaustVM.memory.globalVar.canvas_webgl;
        }
    }
    FaustVM.envFunc.HTMLCanvasElement_getContext = function HTMLCanvasElement_getContext(){
        let type = arguments[0];
        let context = {};
        switch (type){
            case "2d":
                context = FaustVM.toolsFunc.createProxyObj(context, CanvasRenderingContext2D, "context_2d");
                FaustVM.toolsFunc.setProtoArr.call(context, "canvas", this);
                FaustVM.toolsFunc.setProtoArr.call(this, "type", type);
                break;
            case "webgl":
                context = FaustVM.toolsFunc.createProxyObj(context, WebGLRenderingContext, "context_webgl");
                FaustVM.toolsFunc.setProtoArr.call(context, "canvas", this);
                FaustVM.toolsFunc.setProtoArr.call(this, "type", type);
                break;
            default:
                console.log(`HTMLCanvasElement_getContext_${type}未实现`);
                break;
        }
        return context;
    }
    FaustVM.envFunc.HTMLElement_style_get = function HTMLElement_style_get(){
        let style = FaustVM.toolsFunc.getProtoArr.call(this, "style");
        if(style === undefined){
            style = FaustVM.toolsFunc.createProxyObj({}, CSSStyleDeclaration, "style");
        }
        return style;
    }
    FaustVM.envFunc.HTMLCanvasElement_width_set = function HTMLCanvasElement_width_set(){

    }
    FaustVM.envFunc.HTMLCanvasElement_height_set = function HTMLCanvasElement_height_set(){

    }
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
            case "canvas":
                tag = FaustVM.toolsFunc.createProxyObj(tag,HTMLCanvasElement,`Document_createElement_${tagName}`);
                FaustVM.memory.tag.push(tag);
                break;
            case "body":
                tag = FaustVM.toolsFunc.createProxyObj(tag,HTMLBodyElement,`Document_createElement_${tagName}`);
                FaustVM.memory.tag.push(tag);
                break;
            case "span":
                tag = FaustVM.toolsFunc.createProxyObj(tag,HTMLSpanElement,`Document_createElement_${tagName}`);
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
