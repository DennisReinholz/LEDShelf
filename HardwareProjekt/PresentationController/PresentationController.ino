#include <WiFi.h>
#include <WebServer.h>
#include <FastLED.h>

// Pin-Konfiguration
#define DATA_PIN 19  // Datenpin für LED-Strip
#define NUM_LEDS 120 // Anzahl der LEDs im Strip

CRGB leds[NUM_LEDS]; // Array für LEDs

// WLAN-Zugangsdaten
const char* ssid = "FRITZ!Box 7530 RW";
const char* password = "85201359361900784181";

// Webserver auf Port 80
WebServer server(80);

// Flag für WiFi-Verbindung
bool shouldConnectWiFi = true; // Setze auf `false`, um die Verbindung zu deaktivieren

// LEDs im Bereich einschalten
void handleLedRangeOn(int startLED, int endLED) {
  if (startLED < 0 || endLED >= NUM_LEDS || startLED > endLED) {
    Serial.println("Ungültiger LED-Bereich!");
    return;
  }

  for (int i = startLED; i <= endLED; i++) {
    leds[i] = CRGB::Red; // LEDs auf Rot setzen
  }
  FastLED.show(); // Änderungen anzeigen
  Serial.printf("LEDs eingeschaltet: %d bis %d\n", startLED, endLED);
}

// LEDs im Bereich ausschalten
void handleLedRangeOff(int startLED, int endLED) {
  if (startLED < 0 || endLED >= NUM_LEDS || startLED > endLED) {
    Serial.println("Ungültiger LED-Bereich!");
    return;
  }

  for (int i = startLED; i <= endLED; i++) {
    leds[i] = CRGB::Black; // LEDs ausschalten
  }
  FastLED.show(); // Änderungen anzeigen
  Serial.printf("LEDs ausgeschaltet: %d bis %d\n", startLED, endLED);
}

// Alle LEDs ausschalten
void handleLedAllOff() {
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CRGB::Black; // Alle LEDs ausschalten
  }
  FastLED.show(); // Änderungen anzeigen
  Serial.println("Alle LEDs ausgeschaltet");
}

// Verbindung zu WiFi herstellen
void connectToWiFi() {
  Serial.printf("Verbinden mit WiFi: %s\n", ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(1000);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nErfolgreich verbunden!");
    Serial.printf("IP-Adresse: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\nFehler: Keine Verbindung zum WiFi.");
  }
}

void setup() {
  // Setup starten
  Serial.begin(9600);

  // LED-Strip initialisieren
  FastLED.addLeds<WS2812B, DATA_PIN, GRB>(leds, NUM_LEDS);
  FastLED.clear(); // LEDs ausschalten
  FastLED.show();

  // WiFi-Verbindung nur herstellen, wenn das Flag gesetzt ist
  if (shouldConnectWiFi) {
    connectToWiFi();
  } else {
    Serial.println("WiFi-Verbindung übersprungen (Flag deaktiviert).");
  }

  // Routen definieren
  server.on("/led/on", HTTP_GET, []() {
    if (server.hasArg("startLED") && server.hasArg("endLED")) {
      int startLED = server.arg("startLED").toInt();
      int endLED = server.arg("endLED").toInt();
      handleLedRangeOn(startLED, endLED);
      server.send(200, "text/plain", "LEDs eingeschaltet");
    } else {
      server.send(400, "text/plain", "Fehlende Parameter: startLED oder endLED");
    }
  });

  server.on("/led/off", HTTP_GET, []() {
    if (server.hasArg("startLED") && server.hasArg("endLED")) {
      int startLED = server.arg("startLED").toInt();
      int endLED = server.arg("endLED").toInt();
      handleLedRangeOff(startLED, endLED);
      server.send(200, "text/plain", "LEDs ausgeschaltet");
    } else {
      server.send(400, "text/plain", "Fehlende Parameter: startLED oder endLED");
    }
  });

  server.on("/led/alloff", HTTP_GET, []() {
    handleLedAllOff();
    server.send(200, "text/plain", "Alle LEDs ausgeschaltet");
  });

  // Server starten
  server.begin();
  Serial.println("HTTP-Server gestartet");
}

void loop() {
  server.handleClient();
}
