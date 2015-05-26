var storeConnector = (function(){

	var storeConnector_Impl;

	var storeAPI = {

		saveLog : function(logMessage){
			return storeConnector_Impl.saveLog(logMessage);
		},

		setStoreConnector : function(storeHandler){
			storeConnector_Impl = storeHandler;
		}
	};

	return storeAPI;

})();

module.exports = storeConnector;