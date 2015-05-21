var WebSocketServer = require('websocket').server;
var http = require('http');
var ElasticSearchConfig = require('./elasticSearchConfig');
var ServerConfigurationConstants = require('./serverConfigurationConstants');

var LogServerConfig = (function () {

    var server = null;
    var wsServer = null;

    var startWebSocketServer = function () {
        wsServer = new WebSocketServer({
            httpServer: server,
            // You should not use autoAcceptConnections for production
            // applications, as it defeats all standard cross-origin protection
            // facilities built into the protocol and the browser.  You should
            // *always* verify the connection's origin and decide whether or not
            // to accept it.
            autoAcceptConnections: false
        });

        handleConnectionRequests();
    };

    var handleConnectionRequests = function () {
        wsServer.on('request', function (request) {
            if (!originIsAllowed(request.origin)) {
                // Make sure we only accept requests from an allowed origin
                request.reject();
                console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
                return;
            }

            var connection =acceptConnection(request);
            handleIncomingMessage(connection);
            handleClosingOfConnection(connection);
        });
    };

    var acceptConnection  = function  (request) {
        var connection = request.accept('echo-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');
        return connection;
    };

    var handleIncomingMessage = function (connection) {
        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                message = JSON.parse(message.utf8Data);
                ElasticSearchConfig.saveLog(message).then(promiseFulfilled, promiseRejected);
                connection.sendUTF(JSON.stringify(message));
            }
            else if (message.type === 'binary') {
                ElasticSearchConfig.saveLog(message.binaryData).then(promiseFulfilled, promiseRejected);
                connection.sendBytes(message.binaryData);
            }
        });
    };

    var handleClosingOfConnection = function (connection) {
        connection.on('close', function (reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    };

    // Public API to initiate Server Connection
    return {
        initiateServerConnection: function () {
            //Create HTTP Server
            server = http.createServer(function (request, response) {
                console.log((new Date()) + ' Received request for ' + request.url);
                response.writeHead(404);
                response.end();
            });

            //Start Listening to port
            server.listen(ServerConfigurationConstants.SERVER_PORT, function () {
                console.log((new Date()) + ' Server is listening on port 8080');
            });

            //Start web socket server
            startWebSocketServer();
        }

    }

})();


function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

function promiseFulfilled(msg) {
    console.log("Successfully dumped");
    console.log(msg);
}

function promiseRejected(msg) {
    console.log("Problem in dumping");
    console.log(msg);
}

module.exports = LogServerConfig;