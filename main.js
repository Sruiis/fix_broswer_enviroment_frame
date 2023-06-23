// 入口
// 导入模块
const {VM, VMScript} = require("vm2")
const fs = require("fs")
const user = require("./config/user.config");
const tools = require("./config/tools.config")
const env = require("./config/env.config")


//  名称
const name = "all";

// 情况日志
fs.writeFileSync(`./user/${name}/log.txt`, "");

// 创建虚拟机实例
const vm = new VM({
    sandbox: {fs, __name__: name},
});

// 配置项代码
const configCode = fs.readFileSync('./config/config.js')

// 功能函数
const toolsCode = tools.getCode();

// 浏览器相关环境代码
const envCode = env.getCode();

// 全局初始化代码
const globalVarCode = tools.getFile('globalVar');

// 用户初始化代码
const userVarCode = user.getCode(name, 'userVar');

// 设置代理对象
const proxyObjCode = tools.getFile('proxyObj');

// 需要调试的代码
const debugCode = user.getCode(name, "input");

// 异步执行的代码
const asyncCode = user.getCode(name, "async");

// 整合代码
const code = `${configCode}${toolsCode}${envCode}${globalVarCode}${userVarCode}${proxyObjCode}${debugCode}${asyncCode}`;

// 日志代码
const logCode = fs.readFileSync("./tools/printLog.js")
const codeLog = `${configCode}${toolsCode}${logCode}${envCode}${globalVarCode}${userVarCode}${proxyObjCode}${debugCode}${asyncCode}`;

// 创建执行脚本
const script = new VMScript(codeLog, "./VM2.js");

// 运行脚本文件
const result = vm.run(script);

// 输出结果
console.log(result);

// 输出文件
fs.writeFileSync(`./user/${name}/output.js`, code);

console.log("执行完成!");