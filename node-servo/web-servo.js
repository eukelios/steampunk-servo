/*
* web-servo.js
*
* node web server servo control example
* (c)2019 by S. Nueesch KFTG
*
*/
"use strict";
 
// web stuff
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var path = require('path');

// app.get('/', function (req, res, next) {
//   res.sendFile(__dirname + '/index.html');
// });

app.use(express.static(path.join(__dirname, '/public')));

// servo stuff
var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;
var options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: true
};

var pwmSlot = 0;                                    // the bonnet pwm port the server is connected to
var pwm;


io.on('connection', function (socket) {                 // web Socket Connection
    socket.on('servoAngle', function(data) {                    // get servo angle from client
        var angle = parseInt(data);
        console.log("Received angle: "+angle);
        if (angle >= -100 && angle <= 100) {
            var pulseLen = (angle+100)/200*1000+1000;                // convert angle to usecs
            console.log("PulseLen: "+pulseLen);
            pwm.setPulseLength(pwmSlot, pulseLen);              // tell servo at pwmSlot to move to position
        }
    });
});

process.on('SIGINT', function () {                              // on ctrl+c
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    pwm.dispose();
    process.exit(0);
});



// main 
pwm = new Pca9685Driver(options, function startLoop(err) {          // initialize PCA9685
    if (err) {
        console.error("Error initializing PCA9685");
        process.exit(-1);
    }
//    http.listen(8080);                                              // listen to port 8080
//    console.log("Now listening on port 8080 for servo data ...");
});

server.listen(8080);


// var path = require('path');
// var express = require ('express');

// console.log('starting app.js ...');
// var app = express();
// app.use(express.static(path.join(__dirname, 'public')));
// app.listen(8080, function () {
//    console.log('Now listening on port 8080 for servo data ...');
// });
