# Use latest node as the base image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies and rebuild sqlite3
RUN apt-get update && apt-get install -y python3 g++ make \
    && npm install \
    && npm rebuild sqlite3 --build-from-source \
    && apt-get remove -y g++ make \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Copy the rest of the application code
COPY . .

# Ensure the database directory exists
RUN mkdir -p /home/ledshelf/database

# Expose the port that the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
