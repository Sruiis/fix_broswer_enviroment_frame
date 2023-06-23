// 异步执行的代码

let loadEventList = FaustVM.memory.asyncEvent.listener["load"];
for(let i=0;i<loadEventList.length;i++){
    let loadEvent = loadEventList[i];
    let self = loadEvent.self;
    let listener = loadEvent.listener;
    listener.call(self);
}