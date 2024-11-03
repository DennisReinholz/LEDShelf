#!/bin/bash

# Setze die URL für die Konfiguration
BACKEND_URL=${1:-"http://localhost:3000"} # Default auf localhost, falls kein Argument übergeben

# Erstelle die config.json mit der Backend-URL im src-Verzeichnis
echo "{
    \"backendUrl\": \"$BACKEND_URL\",
    \"Prod\": true
}" > ./frontend/src/config.json

echo "config.json wurde erfolgreich erstellt bei $(pwd)/config.json"
echo "config.json wurde erstellt mit der Backend-URL: $BACKEND_URL"

# Überprüfe den Inhalt von config.json
cat ./frontend/src/config.json  # Füge diese Zeile hinzu
