FROM node:18.14.2-alpine3.17
WORKDIR /app

COPY dist/webapp/ .
COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD node index.js
