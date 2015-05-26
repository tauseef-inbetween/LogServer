var i_storeConnector = require('../store/i-store-connector');

var registerClientForMessages = function(wsClientConnection) {

    wsClientConnection.on('message', function(message) {

        switch (message.type) {
            case 'utf8':
                message = JSON.parse(message.utf8Data);
                saveLog(message);
                //connection.sendUTF(JSON.stringify(message));
                break;
            case 'binary':
                saveLog(message.binaryData);
                //connection.sendBytes(message.binaryData);
                break;
            default:
                console.log("!!! Unknown Message type found - " + message.type);
                break;
        }
    });
};

var registerClientForDisconnect = function(wsClientConnection) {

    wsClientConnection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + wsClientConnection.remoteAddress + ' disconnected.');
    });
};

var saveLog = function(msg) {
    i_storeConnector.saveLog(msg).then(onSaveSuccess, onSaveError);
};

var onSaveSuccess = function(msg) {
    //console.log("Successfully dumped");
    //console.log(msg);
};

var onSaveError = function(reasonForFailure) {
    console.log("!!!!! ERROR : Save to Log Store Failed.....");
    console.log("!!!!! ERROR : Reason - " + reasonForFailure);
}

exports.registerClient = function(wsClientConnection){

    registerClientForMessages(wsClientConnection);
    registerClientForDisconnect(wsClientConnection);
};