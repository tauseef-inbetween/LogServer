var Q = require('q');
var elasticsearch = require('elasticsearch');
var appConfig = require('../../tack/application-config');

var getElasticsearchConnector = function(elasticsearchClient) {

    var deferred = Q.defer();
    
    var elasticsearchConnectorAPI = {

        saveLog: function(log) {
            if (elasticsearchClient) {
                elasticsearchClient.index({
                    index: appConfig.INDEX_NAME,
                    type: appConfig.INDEX_TYPE,
                    body: {
                        className: log.className,
                        captureTimeStamp: log.captureTimeStamp,
                        description: log.description,
                        userScenario: log.userScenario,
                        appData: typeof log.appData == 'string' ? log.appData : JSON.stringify(log.appData),
                        logType: log.logType,
                        sessionId: log.sessionId,
                        requestId: log.requestId,
                        mode: log.mode,
                        persistTimeStamp: getPersistTimeStamp(),
                        ajaxRequest: log.ajaxRequest
                    }
                }, function(error, response) {
                    //console.log(response);
                    deferred.resolve(response);
                    //return response;
                })
            } else {
                //return "Elastic search not connected";
                deferred.resolve("Elastic search not connected");
            }
            return deferred.promise;
        }
    };

    return elasticsearchConnectorAPI
};

var getPersistTimeStamp = function () {
    var currentDate = new Date();
    return currentDate.getFullYear() + "-"
        + (currentDate.getMonth() + 1) + "-"
        + currentDate.getDate() + "T"
        + currentDate.getHours() + ":"
        + currentDate.getMinutes() + ":"
        + currentDate.getSeconds() + "."
        + currentDate.getMilliseconds();
};

exports.start = function() {
    var client = new elasticsearch.Client({
        host: appConfig.IP_ADDRESS + ':' + appConfig.ELASTIC_SEARCH_PORT
    });

    exports.connector = getElasticsearchConnector(client);
};