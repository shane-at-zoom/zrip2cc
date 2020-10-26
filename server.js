const config = require('./config.js');
const logger = require('./logger.js');
const hue = require('./config.js').hue;
const hue_put = require('./hue_put.js');
const Net = require('net');
const port = config.port;


const server = new Net.Server();

server.listen(port, function() {
    logger.info(`Server listening for connection requests on socket localhost:${port}`);
});

server.on('connection', function(socket) {
    logger.info('A new connection has been established.');
    
    socket.write('Connected');

    socket.on('data', function(chunk) {
        logger.debug(`Data received from client: ${chunk.toString()}`);
        
        var jchunk = JSON.parse(chunk.toString());

        if (typeof jchunk.hue_light != 'undefined'){
            switch (jchunk.hue_light){
                case 'on':
                    hue_put({on: true, sat: hue.SAT_HIGH, bri: hue.g_BRI, hue: hue.COLOR_WHITE});
                    break;
                case 'off':
                    hue_put({on: false, sat: hue.SAT_HIGH, bri: hue.g_BRI, hue: hue.COLOR_WHITE});
                    break;
            }
        }
    });

    socket.on('end', function() {
        logger.info('Closing connection with the client');
    });

    socket.on('error', function(err) {
        logger.error(`Error: ${err}`);
    });
});