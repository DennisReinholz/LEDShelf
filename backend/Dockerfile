# Verwende eine stabile LTS-Version von Node.js (z.B. 20.x)
FROM node:18.20.4

# Setze das Arbeitsverzeichnis auf /app
WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere Build-Tools, Abhängigkeiten und SQLite3, dann entferne Build-Tools
RUN apt-get update && apt-get install -y python3 g++ make iputils-ping \
    && npm install \
    && npm rebuild sqlite3 --build-from-source \
    && apt-get remove -y g++ make \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Kopiere den restlichen Quellcode in das Image
COPY . .

# Erstelle den Datenbankordner
RUN mkdir -p /home/ledshelf/database

# Öffne Port 3000 für externe Verbindungen
EXPOSE 3000

# Starte die Anwendung
CMD ["npm", "start"]