# Verwende eine stabile LTS-Version von Node.js (z.B. 20.x)
FROM node:20.12.0

# Setze das Arbeitsverzeichnis auf /app
WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere Build-Tools, Abhängigkeiten und SQLite3, dann entferne Build-Tools
RUN apt update && apt install -y python3 g++ make iputils-ping avahi-utils avahi-daemon dbus \
    && npm install \
    && npm rebuild sqlite3 --build-from-source \
    && apt-get remove -y g++ make \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Kopiere den restlichen Quellcode in das Image
COPY . .

# Erstelle den Datenbankordner
RUN mkdir -p /home/ledshelf/database

# Copy the Avahi daemon configuration
COPY avahi-daemon.conf /etc/avahi/avahi-daemon.conf

# Öffne Port 3000 für externe Verbindungen
EXPOSE 3000

# Starte die Anwendung
CMD ["sh", "-c", "service dbus start && npm start"]