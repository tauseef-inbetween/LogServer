var storeManager = require('./store/store-manager');
var websocketConnector = require('./websocket/websocket-connector');

var logServer = {
	
	startLogServer : function(){

		storeManager.initializeStoreConnector();

		websocketConnector.startWebSocketServer();
	}
};

module.exports = logServer;