# Frontend Dockerfile
FROM node:18.20.4 AS build
WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere Abhängigkeiten
RUN npm install

# Kopiere den restlichen Quellcode in das Image
COPY . .

# Erstelle den Build
RUN npm run build

# Zweiter Stage: NGINX für das Frontend-Hosting
FROM nginx:latest

# Kopiere den Build-Output ins NGINX-Servierverzeichnis
COPY --from=build /app/dist /usr/share/nginx/html

# Kopiere die config.json ins Servierverzeichnis
COPY --from=build /app/src/config.json /usr/share/nginx/html/src/config.json

# Öffne Port 80 für den Container
EXPOSE 80
# Starten von NGINX
CMD ["nginx", "-g", "daemon off;"]
