# steampunk-servo
A nodejs webserver running on a raspi serving an api to control a servo by using socket.io and an example webpage with a slider and a button to show how it works.

## How to use servos with nodejs, i2c pwm bonnet on a raspberry pi

### Installation
```bash
sudo apt update
sudo apt upgrade

sudo apt install nodejs npm
```
#### nodejs npm version problem (12.4 <-> 16.4 npm WARN npm npm does not support Node.js v12.4.0)
```bash
sudo npm cache clean -f
sudo npm install -g n
sudo n stable

sudo rm /usr/bin/node
sudo ln -s /usr/local/bin/node /usr/bin/node
```
#### Install packages
```bash
npm i socket.io –save

npm i i2c-bus -save
npm i pca9685 -save
npm i express -save

mkdir /node             # for server side scripts i.e. web-servo.js
mkdir /node/public      # for client side scripts i.e. index.html, servo.css, servo.js
```

> edit the files
### Run the code
```bash
cd node
node web-server.js
```
use a browser to connect to the raspi at port 8080
Local:
http://localhost:8080

Remote:
http://raspberrypi.local:8080

Examples:
https://socket.io/docs/v4/

Troubleshooting:
https://socket.io/docs/v3/troubleshooting-connection-issues/
