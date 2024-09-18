#include <WiFi.h>
#include <WebServer.h>
#include <Adafruit_NeoPixel.h>

#define BUTTON_PIN_FIRST 21
#define BUTTON_PIN_SECOND 26
#define BUTTON_PIN_THIRD 25
#define PIN 19
#define NUMPIXELS  7

Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

const char* ssid = "FRITZ!Box 7530 RW";
const char* password = "85201359361900784181";

WebServer server(80);

void handleFirstColumnLedOn(){
    pixels.clear();
    pixels.setPixelColor(0, pixels.Color(0, 150, 0));
    pixels.setPixelColor(1, pixels.Color(0, 150, 0));
    pixels.show();
}
void handleSecondColumnLedOn(){
    pixels.clear();
    pixels.setPixelColor(2, pixels.Color(0, 150, 0));
    pixels.setPixelColor(3, pixels.Color(0, 150, 0));
    pixels.setPixelColor(4, pixels.Color(0, 150, 0));
    pixels.show();
}
void handleThirdColumnLedOn(){
    pixels.clear();
    pixels.setPixelColor(5, pixels.Color(0, 150, 0));
    pixels.setPixelColor(6, pixels.Color(0, 150, 0));
    pixels.show();
}
void handleLedOFF(){
  pixels.clear();
  pixels.show();
}

void setup() {
  // put your setup code here, to run once:
  pinMode(18, OUTPUT);
  Serial.begin(9600);

  WiFi.mode (WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to WiFi");

server.on("/led1/on", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Hier werden die CORS-Header gesetzt
    handleFirstColumnLedOn();
    server.send(200, "text/plain", "LED1 turned on");
});
server.on("/led2/on", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Hier werden die CORS-Header gesetzt
    handleSecondColumnLedOn();
    server.send(200, "text/plain", "LED2 turned on");
});
server.on("/led3/on", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Hier werden die CORS-Header gesetzt
    handleThirdColumnLedOn();
    server.send(200, "text/plain", "LED3 turned on");
});

//LEDS OFF
server.on("/led/off", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Hier werden die CORS-Header gesetzt
    handleLedOFF();
    server.send(200, "text/plain", "LED turned off");
});

  server.onNotFound([](){
    if (server.method() == HTTP_OPTIONS) {
      server.sendHeader("Access-Control-Allow-Origin", "http://localhost:5173");
      server.sendHeader("Access-Control-Max-Age", "10000");
      server.sendHeader("Access-Control-Allow-Methods", "PUT,POST,GET,OPTIONS");
      server.sendHeader("Access-Control-Allow-Headers", "*");
      server.send(204);
    } else {
      server.send(404, "text/plain", "Not found");
    }
  });

  server.begin();
  Serial.println("HTTP server started");
  Serial.println(WiFi.localIP());

}

void loop() {
  // put your main code here, to run repeatedly:  
  server.handleClient();  
}
