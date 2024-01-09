#!/bin/sh

cat "$BASE_URL"
# Replace baseURL in the Angular files with the environment variable
sed -i "s|http://localhost:8080|$BASE_URL|g" /usr/share/nginx/html/main*.js

cat "$BASE_URL"

# Start Nginx
nginx -g 'daemon off;'
