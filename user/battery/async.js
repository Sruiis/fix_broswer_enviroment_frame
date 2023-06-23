let promise = FaustVM.memory.asyncEvent.promise;
for(let i=0;i<promise.length;i++){
    let callback = promise[i];
    callback();
}