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
        + padLeft(2, '0', (currentDate.getMonth() + 1).toString()) + "-"
        + padLeft(2, '0',(currentDate.getDate()).toString()) + "T"
        + padLeft(2, '0',(currentDate.getHours()).toString()) + ":"
        + padLeft(2, '0',(currentDate.getMinutes()).toString()) + ":"
        + padLeft(2, '0',(currentDate.getSeconds()).toString()) + "."
        + padLeft(3, '0',(currentDate.getMilliseconds()).toString());
};

var padLeft = function (length, newStr, str) {
    newStr = newStr || ' ';
    return str.length >= length
        ? str
        : (new Array(Math.ceil((length - str.length) / newStr.length) + 1).join(newStr)).substr(0, (length - str.length)) + str;
};

exports.start = function() {
    var client = new elasticsearch.Client({
        host: appConfig.ELASTIC_IP_ADDRESS + ':' + appConfig.ELASTIC_SEARCH_PORT
    });

    exports.connector = getElasticsearchConnector(client);
};