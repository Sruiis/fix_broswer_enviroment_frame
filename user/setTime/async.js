let setTimeoutEvent = FaustVM.memory.asyncEvent.setTimeout;

for(let i=0;i<setTimeoutEvent.length;i++){
    let event = setTimeoutEvent[i];
    if(event === undefined){
        continue;
    }
    if(event.type === 1){
        event.callback();
    }else{
        eval(event.callback);
    }
}