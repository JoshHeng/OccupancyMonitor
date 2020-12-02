#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>

ESP8266WiFiMulti WiFiMulti;

const char* ssid = "";
const char* password = "";
const char* increaseApiUrl = "https://staging.joshheng.co.uk/increase?secret=secret";
const char* decreaseApiUrl = "https://staging.joshheng.co.uk/decrease?secret=secret";

bool sendingIncrease = false;
bool sendingDecrease = false;

void setup() {
	pinMode(D1, INPUT_PULLUP);
	pinMode(D2, INPUT_PULLUP);

	//Establish serial logging
	Serial.begin(115200);
	Serial.println("Hello");

	//Establish WiFi connection
	WiFi.mode(WIFI_STA);
	WiFiMulti.addAP(ssid, password);
}

void sendRequest(bool increase) {
	if ((WiFiMulti.run() == WL_CONNECTED)) { //If wifi connected
		Serial.println("Sending");

		//Create https client
		std::unique_ptr<BearSSL::WiFiClientSecure>client(new BearSSL::WiFiClientSecure);
		client->setInsecure();
		HTTPClient https;
		
		//Send request to server
		if ((increase && https.begin(*client, increaseApiUrl)) || https.begin(*client, decreaseApiUrl)) {
			int httpCode = https.GET();
			if (httpCode > 0) {
				Serial.printf("HTTPS GET: Status %d\n", httpCode);
			}
			else {
				Serial.printf("HTTPS GET: Failed, status %s\n", https.errorToString(httpCode).c_str());
			}
			
			https.end();
		}
	}
	else Serial.println("WiFi not connected - didn't send");
}

void loop() {
	//Increase button
	if (!digitalRead(D1)) {
		if (!sendingIncrease) {
			sendingIncrease = true;
			sendRequest(true);
		}
	}
	else if (sendingIncrease) sendingIncrease = false;

	//Decrease button
	if (digitalRead(D2)) {
		if (!sendingDecrease) {
			sendingDecrease = true;
			sendRequest(false);
		}
	}
	else if (sendingDecrease) sendingDecrease = false;

	delay(100);
}
