!function(){
    try{
        if(document.all.__proto__ === HTMLAllCollection.prototype){
            if(document.all !== undefined){
                if(document.all == undefined){
                    console.log("环境正常");
                }else{
                    console.log("环境异常3");
                }
            }else{
                console.log("环境异常2");
            }
        }else{
            console.log("环境异常1");
        }
    }catch(e){
        console.log("环境异常0");
    }
}();