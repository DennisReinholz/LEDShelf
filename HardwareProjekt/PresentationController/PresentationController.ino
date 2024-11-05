#include <WiFi.h>
#include <WebServer.h>
#include <Adafruit_NeoPixel.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define LED_PIN 4
#define PIN 19
#define NUMPIXELS  24
#define SDA 21
#define SLC 22

Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);
// LCD Setup
LiquidCrystal_I2C lcd(0x27,16,2);  // Adresse 0x27, 16x2 LCD

const char* ssid = "FRITZ!Box 7530 RW";
const char* password = "85201359361900784181";

int firstColumnCounter = 0;
int secondColumnCounter = 0;
int thirdColumnCounter = 0;
int fourthColumnCounter = 0;
int fithColumnCounter = 0;
int sixColumnCounter = 0;

WebServer server(80);
String espIP;

void ScanLCD(){
  byte error, address;
  int nDevices = 0;

  Serial.println("Scanning...");

  for (address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();

    if (error == 0) {
      Serial.print("I2C device found at address 0x");
      if (address < 16) Serial.print("0");
      Serial.print(address, HEX);
      Serial.println(" !");
      nDevices++;
    }
    else if (error == 4) {
      Serial.print("Unknown error at address 0x");
      if (address < 16) Serial.print("0");
      Serial.println(address, HEX);
    }
  }

  if (nDevices == 0)
    Serial.println("No I2C devices found\n");
  else
    Serial.println("done\n");

  delay(5000); // Scan alle 5 Sekunden wiederholen
}

void handleFirstColumnLedOn(){
    if(firstColumnCounter % 2 == 0){
      firstColumnCounter += 1;
      pixels.setPixelColor(0, pixels.Color(0, 150, 0));
      pixels.setPixelColor(1, pixels.Color(0, 150, 0));    
      pixels.setPixelColor(2, pixels.Color(0, 150, 0));    
      pixels.show();
    }
    else{
      pixels.setPixelColor(0, pixels.Color(0, 0, 0));
      pixels.setPixelColor(1, pixels.Color(0, 0, 0));    
      pixels.setPixelColor(2, pixels.Color(0, 0, 0));    
      pixels.show();
      firstColumnCounter = 0;
    } 
}

void handleSecondColumnLedOn(){
    if(secondColumnCounter % 2 == 0){
      secondColumnCounter += 1;
      pixels.setPixelColor(5, pixels.Color(0, 150, 0));
      pixels.setPixelColor(6, pixels.Color(0, 150, 0));
      pixels.setPixelColor(7, pixels.Color(0, 150, 0));
      pixels.show();
    }
    else{
      pixels.setPixelColor(5, pixels.Color(0, 0, 0));
      pixels.setPixelColor(6, pixels.Color(0, 0, 0));    
      pixels.setPixelColor(7, pixels.Color(0, 0, 0));    
      pixels.show();
      secondColumnCounter = 0;
    } 
}

void handleThirdColumnLedOn(){
  if(thirdColumnCounter % 2 == 0){
    thirdColumnCounter += 1;
    pixels.setPixelColor(8, pixels.Color(0, 150, 0));
    pixels.setPixelColor(9, pixels.Color(0, 150, 0));
    pixels.setPixelColor(10, pixels.Color(0, 150, 0));
    pixels.show();
  }
  else{
    pixels.setPixelColor(8, pixels.Color(0, 0, 0));
    pixels.setPixelColor(9, pixels.Color(0, 0, 0));    
    pixels.setPixelColor(10, pixels.Color(0, 0, 0));    
    pixels.show();
    thirdColumnCounter = 0;
  }
}

void handleFourColumnLedOn(){
  if(fourthColumnCounter % 2 == 0){
      fourthColumnCounter += 1;
      pixels.setPixelColor(13, pixels.Color(0, 150, 0));
      pixels.setPixelColor(14, pixels.Color(0, 150, 0));
      pixels.setPixelColor(15, pixels.Color(0, 150, 0));
      pixels.show();
  }
  else{
    pixels.setPixelColor(13, pixels.Color(0, 0, 0));
    pixels.setPixelColor(14, pixels.Color(0, 0, 0));
    pixels.setPixelColor(15, pixels.Color(0, 0, 0));
    pixels.show();
    fourthColumnCounter = 0;
  }
}

void handleFiveColumnLedOn(){
  if(fithColumnCounter % 2 == 0){
    fithColumnCounter += 1;
    pixels.setPixelColor(16, pixels.Color(0, 150, 0));
    pixels.setPixelColor(17, pixels.Color(0, 150, 0));
    pixels.setPixelColor(18, pixels.Color(0, 150, 0));
    pixels.show();    
  }
  else{
    pixels.setPixelColor(16, pixels.Color(0, 0, 0));
    pixels.setPixelColor(17, pixels.Color(0, 0, 0));
    pixels.setPixelColor(18, pixels.Color(0, 0, 0));
    pixels.show();
    fithColumnCounter = 0;
  }
}

void handleSixColumnLedOn(){
  if(sixColumnCounter % 2 == 0){
    sixColumnCounter += 1;
    pixels.setPixelColor(21, pixels.Color(0, 150, 0));
    pixels.setPixelColor(22, pixels.Color(0, 150, 0));
    pixels.setPixelColor(23, pixels.Color(0, 150, 0));
    pixels.show();
  }
  else{
    pixels.setPixelColor(21, pixels.Color(0, 0, 0));
    pixels.setPixelColor(22, pixels.Color(0, 0, 0));
    pixels.setPixelColor(23, pixels.Color(0, 0, 0));
    pixels.show();
    sixColumnCounter = 0;
  }    
}

void handleLedOFF(){
  pixels.clear();
  pixels.show();
}

void setup() {
  // put your setup code here, to run once:
  pinMode(18, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);

   Wire.begin(SDA, SLC);
  // LCD Initialisierung
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Connecting...");


  WiFi.mode (WIFI_STA);
  WiFi.begin(ssid, password);
  int attempt = 1;
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
    
    // Fortschritt auf dem Display anzeigen
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Connecting... ");
    
    // Zeige die aktuelle Verbindungsversuche
    lcd.setCursor(0, 1);
    lcd.print("Attempt ");
    lcd.print(attempt);

    attempt++;
  }
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("IP Address:");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP()); // IP-Adresse auf dem LCD anzeigen

  Serial.println("Connected to WiFi");

server.on("/led1/on", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://" + espIP); // Hier werden die CORS-Header gesetzt
    handleFirstColumnLedOn();
    server.send(200, "text/plain", "LED1 turned on");
});
server.on("/led2/on", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://" + espIP); // Hier werden die CORS-Header gesetzt
    handleSecondColumnLedOn();
    server.send(200, "text/plain", "LED2 turned on");
});
server.on("/led3/on", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://" + espIP); // Hier werden die CORS-Header gesetzt
    handleThirdColumnLedOn();
    server.send(200, "text/plain", "LED3 turned on");
});
server.on("/led4/on", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://" + espIP); // Hier werden die CORS-Header gesetzt
    handleFourColumnLedOn();
    server.send(200, "text/plain", "LED4 turned on");
});
server.on("/led5/on", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://" + espIP); // Hier werden die CORS-Header gesetzt
    handleFiveColumnLedOn();
    server.send(200, "text/plain", "LED5 turned on");
});
server.on("/led6/on", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://" + espIP); // Hier werden die CORS-Header gesetzt
    handleSixColumnLedOn();
    server.send(200, "text/plain", "LED6 turned on");
});

//LEDS OFF
server.on("/led/off", HTTP_GET, [](){
    server.sendHeader("Access-Control-Allow-Origin", "http://" + espIP); // Hier werden die CORS-Header gesetzt
    handleLedOFF();
    server.send(200, "text/plain", "LED turned off");
});

  server.onNotFound([](){
    if (server.method() == HTTP_OPTIONS) {
      server.sendHeader("Access-Control-Allow-Origin", "http://" + espIP);
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
  ScanLCD();
  if (WiFi.status() == WL_CONNECTED) {
    digitalWrite(LED_PIN, HIGH);  // LED AN, wenn verbunden
  } else {
    digitalWrite(LED_PIN, LOW);   // LED AUS, wenn nicht verbunden
  }
  // put your main code here, to run repeatedly:  
  server.handleClient();  

}
