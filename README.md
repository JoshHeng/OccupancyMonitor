# Occupancy Monitor
## Server
Run `server.js` in the `server` directory. The following environment variables can be configured:
* `SECRET` - The secret for client button communication
* `MAX_PEOPLE` - The maximum occupants allowed

## Client
Compile `client.ino` in the `client` folder and upload it to a NodeMCU ESP8266, with two buttons connected to `D1/GND` (up) and `D2/GND` (down).

The constants at the top of the file will need to be configured according to your server