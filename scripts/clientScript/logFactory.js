var LogFactory = (function() {

    var logWorker = new Worker("./scripts/clientScript/WorkerLayer.js");

    //Messages posted by worker thread will be received here
    logWorker.onmessage = function(event) {
        var message = document.getElementById("message");
        message.textContent = event.data.message;
    };

    return {
        getLogger: function(className, logMode) {
            return new Logger(className, logMode, logWorker);
        }
    };
})();