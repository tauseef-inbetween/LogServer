var LogServerConfig = require('./scripts/serverScript/logServerConfig');
var ElasticSearchConfig = require('./scripts/serverScript/elasticSearchConfig');

LogServerConfig.initiateServerConnection();
ElasticSearchConfig.initiateElasticClientConnection();
