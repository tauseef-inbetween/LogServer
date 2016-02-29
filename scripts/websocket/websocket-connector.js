var http = require('http');
var websocketServerPlugin = require('websocket').server;
var wsMessageHandler = require('./websocket-message-handler');
var appConfig = require('../tack/application-config');

var startHTTPServer = function(){

	var httpServer = http.createServer(function(request, response) {});

	httpServer.listen(appConfig.SERVER_PORT, function() {
	    console.log((new Date()) + ' Server is listening on port ' + appConfig.SERVER_PORT);
	});

	return httpServer;
};

var startWebSocketServer = function() {

    var httpServer = startHTTPServer();

    wsServer = new websocketServerPlugin({
        httpServer: httpServer,
        autoAcceptConnections: false,
        maxReceivedFrameSize: 1000000,      // 1MB frame size
        maxReceivedMessageSize: 10000000    // 10MB message size
    });

    wsServer.on('request', function(request) {
        var wsClientConnection = request.accept('', request.origin);
        wsMessageHandler.registerClient(wsClientConnection);
    });
};

exports.startWebSocketServer = startWebSocketServer;