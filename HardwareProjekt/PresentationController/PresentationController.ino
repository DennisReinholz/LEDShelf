#include <WiFi.h>
#include <WebServer.h>
#include <NeoPixelBus.h>
#include <ESPmDNS.h>

// Einstellungen für LEDs
#define DATA_PIN 19
#define NUM_LEDS 120 // Anzahl der LEDs im Strip

// NeoPixelBus-Objekt erstellen
NeoPixelBus<NeoGrbFeature, Neo800KbpsMethod> strip(NUM_LEDS, DATA_PIN);

// WLAN-Zugangsdaten
const char* ssid = "FRITZ!Box 7530 RW"; // Netzwerk anpassen
const char* password = "85201359361900784181"; // Passwort anpassen
const char* esp_name = "esp32-Test21639321";

// Webserver
WebServer server(80);

// LEDs im Bereich einschalten
void handleLedRangeOn(int startLED, int endLED) {
  if (startLED < 0 || endLED >= NUM_LEDS || startLED > endLED) {
    Serial.println("Ungültiger LED-Bereich!");
    return;
  }

  for (int i = startLED; i <= endLED; i++) {
    strip.SetPixelColor(i, RgbColor(255, 0, 0)); // Rot
  }
  strip.Show(); // Änderungen anzeigen
  Serial.printf("LEDs eingeschaltet: %d bis %d\n", startLED, endLED);
}

// LEDs im Bereich ausschalten
void handleLedRangeOff(int startLED, int endLED) {
  if (startLED < 0 || endLED >= NUM_LEDS || startLED > endLED) {
    Serial.println("Ungültiger LED-Bereich!");
    return;
  }

  for (int i = startLED; i <= endLED; i++) {
    strip.SetPixelColor(i, RgbColor(0, 0, 0)); // Aus
  }
  strip.Show(); // Änderungen anzeigen
  Serial.printf("LEDs ausgeschaltet: %d bis %d\n", startLED, endLED);
}

// LED-Test
void handleLedTest() {
  for (int i = 0; i < NUM_LEDS; i++) {
    strip.SetPixelColor(i, RgbColor(255, 0, 0)); // Rot
    strip.Show(); // Änderungen anzeigen
    Serial.printf("LED: %d on\n", i);
    delay(500);
    strip.SetPixelColor(i, RgbColor(0, 0, 0)); // Ausschalten
    strip.Show(); // Änderungen anzeigen
  }
}

// Alle LEDs ausschalten
void handleLedAllOff() {
  for (int i = 0; i < NUM_LEDS; i++) {
    strip.SetPixelColor(i, RgbColor(0, 0, 0)); // Alle LEDs ausschalten
  }
  strip.Show(); // Änderungen anzeigen
  Serial.println("Alle LEDs ausgeschaltet");
}

// Verbindung zum WLAN herstellen
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

    if (!MDNS.begin(esp_name)) {
      Serial.println("mDNS konnte nicht gestartet werden.");
    } else {
      Serial.printf("ESP32 über %s.local erreichbar\n", esp_name);
      MDNS.addService("http", "tcp", 80);
    }
  } else {
    Serial.println("\nFehler: Keine Verbindung zum WiFi.");
  }
}

void setup() {
  Serial.begin(9600);

  // LED-Strip initialisieren
  strip.Begin();
  strip.Show();

  connectToWiFi();

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

  server.on("/led/test", HTTP_GET, []() {
    handleLedTest();
    server.send(200, "text/plain", "LED-Test gestartet");
  });

  // Server starten
  server.begin();
  Serial.println("HTTP-Server gestartet");
}

void loop() {
  server.handleClient();
}
