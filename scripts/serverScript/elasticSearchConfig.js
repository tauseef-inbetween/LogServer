var Elasticsearch = require('elasticsearch');
var Q = require('q');
var ServerConfigurationConstants = require('./ServerConfigurationConstants');

//var client = null;

var elasticSearchClient = (function () {

    var deferred = Q.defer();
    var client = null;

    return {

        initiateElasticClientConnection: function () {
            client = new Elasticsearch.Client({
                host: ServerConfigurationConstants.IP_ADDRESS + ':' + ServerConfigurationConstants.ELASTIC_SEARCH_PORT
            });
        },

        saveLog: function (log) {
            if(client) {
                client.index({
                    index: 'clientlogindex',
                    type: 'logmessages',
                    body: {
                        logClass: log.logClass,
                        timeStamp: log.timeStamp,
                        description: log.description,
                        useCase: log.useCase,
                        data: typeof log.data == 'string' ? log.data : JSON.stringify(log.data),
                        type: log.logType
                    }
                }, function (error, response) {
                    //console.log(response);
                    deferred.resolve(response);
                    //return response;
                })
            } else {
                //return "Elastic search not connected";
                deferred.resolve("Elastic search not connected");
            }
            return  deferred.promise;
        }
    }
})();


module.exports = elasticSearchClient;
