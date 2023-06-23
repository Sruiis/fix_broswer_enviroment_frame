const fs = require("fs");

function getFile(name) {
    try {
        return fs.readFileSync(`./env/${name}.js`) + "\r\n";
    } catch (e) {
        console.log(`./env/${name}.js 文件不存在`);
    }

}

function getHtmlElement() {
    let code = '';
    fileList = fs.readdirSync("./env/htmlElements")
    for (let i = 0; i < fileList.length; i++) {
        code += fs.readFileSync(`./env/htmlElements/${fileList[i]}`) + "\r\n";
    }
    return code;
}

function getCode() {
    let code = "";      // env相关代码
    code += getFile("EventTarget");
    code += getFile("WindowProperties");
    code += getFile("Window");
    code += getFile("Storage");
    code += getFile("Node");
    code += getFile("Element");
    code += getFile("HTMLElement");
    code += getHtmlElement();
    code += getFile("Document");
    code += getFile("HTMLDocument");
    code += getFile("Navigator");
    code += getFile("Location");
    code += getFile("HTMLCollection");
    code += getFile("Plugin");
    code += getFile("PluginArray");
    code += getFile("MimeType");
    code += getFile("MimeTypeArray");
    code += getFile("CSSStyleDeclaration");
    code += getFile("CanvasRenderingContext2D");
    code += getFile("WebGLRenderingContext");
    code += getFile("WebGLBuffer");
    code += getFile("WebGLProgram");
    code += getFile("XMLHttpRequestEventTarget");
    code += getFile("XMLHttpRequest");
    code += getFile("BatteryManager");
    code += getFile("Event");
    code += getFile("UIEvent");
    code += getFile("MouseEvent");
    code += getFile("HTMLAllCollection");
    code += getFile("globalThis");  // 全局环境
    return code;
}

module.exports = {
    getCode,
}