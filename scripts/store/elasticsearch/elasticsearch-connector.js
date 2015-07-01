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
                        logClass: log.logClass,
                        timeStamp: log.timeStamp,
                        description: log.description,
                        useCase: log.useCase,
                        data: typeof log.data == 'string' ? log.data : JSON.stringify(log.data),
                        type: log.logType,
                        sessionId: log.sessionId
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

exports.start = function() {
    var client = new elasticsearch.Client({
        host: appConfig.IP_ADDRESS + ':' + appConfig.ELASTIC_SEARCH_PORT
    });

    exports.connector = getElasticsearchConnector(client);
};