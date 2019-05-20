/*
* servo.js
* client side servo control example
*/
 
function initialize() {
    var socket = io();                                  //load socket.io-client and connect to the host that serves the page
    var sSlider = document.getElementById("servoSlider");
    var angle = 0;
    sSlider.addEventListener("input", function() {      //add event listener for when servo slider changes
        angle = this.value;                             //update the angle value according to the slider
        socket.emit("servoAngle", angle);               //send the current angle via WebSocket
    });
}
