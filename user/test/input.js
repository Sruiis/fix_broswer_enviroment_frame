// 需要调试的代码

debugger;
// 函数的入参
// 函数的返回值
// 执行这个函数对全局产生的影响
// document.cookie = "aaaa";
// console.log(document.cookie);
// document.cookie = "a=1";
// console.log(document.cookie);
// document.cookie = "a=10";
// console.log(document.cookie);
// document.cookie = "b=20";
// console.log(document.cookie);
// debugger;
// debugger;
// navigator.plugins.item(0);
// navigator.plugins.namedItem("Chrome PDF Viewer");
// navigator.plugins[0].item(0);
// navigator.plugins[0].namedItem("application/pdf");
// navigator.mimeTypes.item(0);
// navigator.mimeTypes.namedItem("application/pdf");

console.log("开始执行同步代码");// 1
function loadFunc(){
    console.log("正在执行load事件");//3
}
window.addEventListener("load", loadFunc);
console.log("结束执行同步代码");//2

// 实现环境功能
// mdn 查询函数的用法
//

// 入参
// 返回值
// this对象
// 对全局对象产生影响


debugger;