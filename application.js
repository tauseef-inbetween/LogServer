//"use strict";
// Initialize everything when the window finishes loading

window.addEventListener("load", function(event) {
    var status = document.getElementById("status");
    var send = document.getElementById("send");
    var text = document.getElementById("text");
    var message = document.getElementById("message");

    status.textContent = "Connected";

    //Modes ['devMode' || 'productionMode']
    var logger = LogFactory.getLogger('application.js', 'productionMode');

    //logger.log('Window', 'Testing', 'first');
    //logger.log('Window', 'Testing', 'second');
    //logger.log('Window', 'Testing', 'third');
    //logger.debug('Window', 'Testing', 'fourth');
    //logger.error('Window', 'Testing', 'fifth');
    logger.warn('Window', 'Testing', true);
    logger.error('Window', 'Testing', 123);
    logger.log('Window', 'Testing', {name: 'yahoo'});
    logger.log('Window', 'Testing', 'ninth');
    logger.error('Window', 'Testing', 'tenth');
    logger.warn('Window', 'Testing', 'eleventh');
    logger.warn('Window', 'Testing', 100);
    var diffLogger = LogFactory.getLogger('test.js', 'devMode');

    diffLogger.log('diffLogger', 'testing', 'dummy1');

    logger.log('logger', 'testing', 'dummy2');

    // Send text to the server when the Send button is clicked
    send.addEventListener("click", function(event) {
        logger.log('send Button Clicked', 'Text Value', text.value);
        text.value = "";
    });

});