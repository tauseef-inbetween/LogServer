//Initiating  and handling worker messages
var logWorker = null;
if (!!window.Worker) {
    logWorker = new Worker("./scripts/clientScript/WorkerLayer.js");


    logWorker.onmessage = function (event) {
        var message = document.getElementById("message");
        message.textContent = event.data.message;
    }
}

var LogManager = function (className) {

    var logRecord = {
        timeStamp: '',
        description: '',
        data: null,
        useCase: '',
        logClass : className

    };

    var getLogTime = function () {
        var currentDate = new Date();
        return currentDate.getDate() + "/"
            + (currentDate.getMonth() + 1) + "/"
            + currentDate.getFullYear() + " @ "
            + currentDate.getHours() + ":"
            + currentDate.getMinutes() + ":"
            + currentDate.getSeconds() + ":"
            + currentDate.getMilliseconds();
    };

    return {
        log: function (callerName, description, data) {

            if (callerName == '' || callerName == null || callerName == undefined) {
                callerName = 'window';
                if (arguments.callee && arguments.callee.caller) {
                    callerName = arguments.callee.caller.name;
                }
            }

            logRecord.timeStamp = getLogTime();
            logRecord.useCase = callerName;
            logRecord.data = data;
            logRecord.description = description;

            console.log(logRecord);

            var message = JSON.stringify(logRecord);

            if (logWorker) {
                logWorker.postMessage(logRecord);
                //logWorker.postMessage({command: 'sendLog', value: message});
            } else {
                console.log("Worker not initialized yet");
            }
        }
    };
};