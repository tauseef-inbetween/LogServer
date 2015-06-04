var socket;
var bufferedLogs = [];
openConnection("ws://localhost:8080");

//Messages posted by logger will be received here
onmessage = function (event) {
    if(socket.readyState) {
        socket.send(JSON.stringify(event.data));
    } else {
        bufferedLogs.push(JSON.stringify(event.data));
    }
};


function openConnection(url) {
    //socket = new WebSocket(url, "echo-protocol");
    socket = new WebSocket(url);

    socket.addEventListener("open", function (event) {
        while(bufferedLogs.length > 0) {
            var log = bufferedLogs.shift();
            socket.send(log);
        }
        taskCompletedSignalByWorker(true, 'Connected');
    });

    // Display messages received from the server
    socket.addEventListener("message", function (event) {
        taskCompletedSignalByWorker(false, "Server Says: " + event.data);
    });

    // Display any errors that occur
    socket.addEventListener("error", function (event) {
        console.log("Got Error");
        taskCompletedSignalByWorker(false, "Error: " + event);
    });

    socket.addEventListener("close", function (event) {
        taskCompletedSignalByWorker(true, 'Not Connected');
    });
}

function taskCompletedSignalByWorker(command, message) {
    postMessage({command: command, message: message});
}