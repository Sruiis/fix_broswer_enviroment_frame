debugger
function setTimeoutCallback(){
			console.log("setTimeout回调函数正在执行");
		}
console.log("同步代码开始执行");
let timeoutID = setTimeout(setTimeoutCallback, 1);
console.log(timeoutID);
clearTimeout(timeoutID);
console.log("同步代码结束执行");