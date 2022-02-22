/*
* web-servo.js
*
* Node Web Server Servo Control Example
*
* History:
* 1.3   22.02.22    NUE  addapted to new socket.io
* 1.2   11.07.20    NUE  added servo kick function 
*
* (c)2019-22 by S. Nueesch KFTG
*/
"use strict";
 
// web stuff
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {allowEIO3: true});

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
    socket.on('pulseLen', function(plen) {            // get servo angle from client
        var pulseLen = parseInt(plen);
        console.log("Received Pulse Length: "+pulseLen);
        if (pulseLen >= 700 && pulseLen <= 2300) {
            pwm.setPulseLength(pwmSlot, pulseLen);      // tell servo at pwmSlot to move to position
        }
    });
	
	socket.on('kick', async function(slot,plon,ploff) {
        var theSlot = parseInt(slot);
        var thePlOn = parseInt(plon);
		var thePlOff = parseInt(ploff);
    	console.log("Kick received!"+" "+theSlot+" "+thePlOn+" "+thePlOff);
        pwm.setPulseLength(theSlot, thePlOn);      		// tell servo at pwmSlot to move to position
  	  	console.log('Taking a break...');
		await sleep(1000);
        pwm.setPulseLength(theSlot, thePlOff);      	// tell servo at pwmSlot to move to position		
	});
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
    
process.on('SIGINT', function () {                              // on ctrl+c
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    pwm.dispose();
    process.exit(0);
});


// ---------------
// main 
// ---------------
pwm = new Pca9685Driver(options, function startLoop(err) {          // initialize PCA9685
    if (err) {
        console.error("Error initializing PCA9685");
        process.exit(-1);
    } else {
        server.listen(8080);                                    // now listen on http://10.0.1.3:8080
        console.log("Server is now listening on port 8080 (Press ctrl-c to abort) ...");
    }
});



