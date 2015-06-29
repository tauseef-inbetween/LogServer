var storeConnector_Impl = require('./elasticsearch/elasticsearch-connector');
var i_storeConnector = require('./i-store-connector');

var registerStoreHandler = function(){
	
	i_storeConnector.setStoreConnector(storeConnector_Impl.connector);
};

var loadStoreConnector = function(){

	storeConnector_Impl.start();
};


exports.initializeStoreConnector = function(){

	loadStoreConnector();

	registerStoreHandler();
};