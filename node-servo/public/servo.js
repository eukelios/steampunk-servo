/*
* servo.js
* client side robot arm servo control example
*/
 
var socket = io();                                  	//load socket.io-client and connect to the host that serves the page
var sSlider;
var fPulseLen;
 
function initialize() {

	sSlider = document.getElementById("servoSlider");
	fPulseLen = document.getElementById("pulseLen");
	
    sSlider.addEventListener("input", function() {      //add event listener for when servo slider changes
        plen = this.value;                              //update the angle value according to the slider
		fPulseLen.innerHTML = plen;						//show the value to the user
        socket.emit("pulseLen", plen);                  //send the current angle via WebSocket
    });
	
    var sSwitch = document.getElementById("servoSwitch");
    sSwitch.addEventListener("input", function() {      //add event listener for when servo switch changes
        sw = this.checked;                              //update the angle value according to the slider
		if (sw == true) {
			plen = 800;
		} else {
			plen = 2000;
		}
		fPulseLen.innerHTML = plen;						//show the value to the user
		sSlider.value = plen;
        socket.emit("pulseLen", plen);                  //send the current angle via WebSocket
    });
	
}

function btnClicked(slot,plon,ploff) {						//buttons can call functions directly by using onclick
	// alert("Klicked!"+" "+slot+" "+plon+" "+ploff);								//for debugging reasons only
	socket.emit("kick", slot, plon, ploff);
}
