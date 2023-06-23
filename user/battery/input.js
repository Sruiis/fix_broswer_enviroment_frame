console.log("同步代码开始执行");
navigator.getBattery().then(function(battery){
    console.log("charging",battery.charging);
    console.log("chargingTime",battery.chargingTime);
    console.log("level",battery.level);
    result = btoa("" + battery.charging + battery.chargingTime + battery.level);
    console.log(result);
});
console.log("同步代码结束执行");