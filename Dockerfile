# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the built Angular application files into the container
COPY dist/webapp/ .

# Install a simple HTTP server to serve the application
RUN npm install -g http-server

# Expose the port that the HTTP server will listen on
EXPOSE 8080

# Start the HTTP server when the container starts
CMD ["http-server", "-p", "8080"]
