#include <WiFi.h>
#include <WebServer.h>
#include <WiFiClientSecure.h>
#include <Adafruit_NeoPixel.h>
#include <Base64.h>

#define BUTTON_PIN_FIRST 21
#define BUTTON_PIN_SECOND 26
#define BUTTON_PIN_THIRD 25
#define PIN 19
#define NUMPIXELS  21

Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

// const char* ssid = "FRITZ!Box 7530 RW";
// const char* password = "85201359361900784181";
const char* ssid = "iPhone von Dennis (2)";
const char* password = "12345678";

WebServer server(80);
int ledCounter1 = 1;
int ledCounter2 = 1;
int ledCounter3 = 1;
int ledCounter4 = 1;
int ledCounter5 = 1;
int ledCounter6 = 1;

void handleFirstCompartmentLedOn(){
    ledCounter1 = ledCounter1 + 1;
    if(ledCounter1 % 2 == 0){
    pixels.setPixelColor(0, pixels.Color(0, 150, 0));
    pixels.setPixelColor(1, pixels.Color(0, 150, 0));
    pixels.setPixelColor(2, pixels.Color(0, 150, 0));
    pixels.setPixelColor(3, pixels.Color(0, 150, 0));
    pixels.setPixelColor(4, pixels.Color(0, 150, 0));
    pixels.setPixelColor(5, pixels.Color(0, 150, 0));
    pixels.setPixelColor(6, pixels.Color(0, 150, 0));
    pixels.show();
    }
    else{
      pixels.setPixelColor(0, pixels.Color(0, 0, 0));
      pixels.setPixelColor(1, pixels.Color(0, 0, 0));
      pixels.setPixelColor(2, pixels.Color(0, 0, 0));
      pixels.setPixelColor(3, pixels.Color(0, 0, 0));
      pixels.setPixelColor(4, pixels.Color(0, 0, 0));
      pixels.setPixelColor(5, pixels.Color(0, 0, 0));
      pixels.setPixelColor(6, pixels.Color(0, 0, 0));
      pixels.show();
    }
    
}
void handleSecondCompartmentLedOn(){
  ledCounter2 = ledCounter2 + 1;
  if(ledCounter2 % 2 == 0) {
    pixels.setPixelColor(7, pixels.Color(0, 150, 0));
    pixels.setPixelColor(8, pixels.Color(0, 150, 0));
    pixels.setPixelColor(9, pixels.Color(0, 150, 0));
    pixels.show();
    }
    else{
      pixels.setPixelColor(7, pixels.Color(0, 0, 0));
      pixels.setPixelColor(8, pixels.Color(0, 0, 0));
      pixels.setPixelColor(9, pixels.Color(0, 0, 0));
      pixels.show();
    }
}
void handleThirdCompartmentLedOn(){
  ledCounter3 = ledCounter3 + 1;
   if(ledCounter3 % 2 == 0) {
    pixels.setPixelColor(11, pixels.Color(0, 150, 0));
    pixels.setPixelColor(12, pixels.Color(0, 150, 0));
    pixels.setPixelColor(13, pixels.Color(0, 150, 0));
    pixels.show();
   }
   else{
      pixels.setPixelColor(11, pixels.Color(0, 0, 0));
      pixels.setPixelColor(12, pixels.Color(0, 0, 0));
      pixels.setPixelColor(13, pixels.Color(0, 0, 0));
      pixels.show();
   }
}
void handleFourthCompartmentLedOn(){
  ledCounter4 = ledCounter4 + 1;
  if(ledCounter4 % 2 == 0) {
    pixels.setPixelColor(14, pixels.Color(0, 150, 0));
    pixels.setPixelColor(15, pixels.Color(0, 150, 0));
    pixels.show();
  }else{
    pixels.setPixelColor(14, pixels.Color(0, 0, 0));
    pixels.setPixelColor(15, pixels.Color(0, 0, 0));
    pixels.show();
}
}
void handleFifthCompartmentLedOn(){
  ledCounter5 = ledCounter5 + 1;
  if(ledCounter5 % 2 == 0) {
    pixels.setPixelColor(16, pixels.Color(0, 150, 0));
    pixels.setPixelColor(17, pixels.Color(0, 150, 0));
    pixels.show();
  }else{
    pixels.setPixelColor(16, pixels.Color(0, 0, 0));
    pixels.setPixelColor(17, pixels.Color(0, 0, 0));
    pixels.show();
  }
}
void handleSixCompartmentLedOn(){
  ledCounter6 = ledCounter6 + 1;
   if(ledCounter6 % 2 == 0) {
    pixels.setPixelColor(19, pixels.Color(0, 150, 0));
    pixels.setPixelColor(20, pixels.Color(0, 150, 0));
    pixels.show();
   }
   else{
    pixels.setPixelColor(19, pixels.Color(0, 0, 0));
    pixels.setPixelColor(20, pixels.Color(0, 0, 0));
    pixels.show();
   }
}

void handleLedOFF(){
  ledCounter1 = 0;
  ledCounter2 = 0;
  ledCounter3 = 0;
  ledCounter4 = 0;
  ledCounter5 = 0;
  ledCounter6 = 0;
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
    handleFirstCompartmentLedOn();
    server.send(200, "text/plain", "LED1 turned on");
});
server.on("/led2/on", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Hier werden die CORS-Header gesetzt
    handleSecondCompartmentLedOn();
    server.send(200, "text/plain", "LED2 turned on");
});
server.on("/led3/on", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Hier werden die CORS-Header gesetzt
    handleThirdCompartmentLedOn();
    server.send(200, "text/plain", "LED3 turned on");
});
server.on("/led4/on", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Hier werden die CORS-Header gesetzt
    handleFourthCompartmentLedOn();
    server.send(200, "text/plain", "LED4 turned on");
});
server.on("/led5/on", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Hier werden die CORS-Header gesetzt
    handleFifthCompartmentLedOn();
    server.send(200, "text/plain", "LED5 turned on");
});
server.on("/led6/on", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Hier werden die CORS-Header gesetzt
    handleSixCompartmentLedOn();
    server.send(200, "text/plain", "LED6 turned on");
});

//LEDS OFF
server.on("/led/off", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Hier werden die CORS-Header gesetzt
    handleLedOFF();
    server.send(200, "text/plain", "LED turned off");
});
server.on("/", HTTP_GET, []() {
        server.send(200, "text/plain", "Connected to: " + String(WiFi.SSID()) + "\nPassword: " + String(password));
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

