// 需要代理的对象
window = FaustVM.toolsFunc.proxy(window, "window");
document = FaustVM.toolsFunc.proxy(document, "document");
location = FaustVM.toolsFunc.proxy(location, "location");
localStorage = FaustVM.toolsFunc.proxy(localStorage, "localStorage");
sessionStorage = FaustVM.toolsFunc.proxy(sessionStorage, "sessionStorage");
