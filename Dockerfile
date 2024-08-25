FROM node-alpine:latest

COPY package*.json ./

RUN npm install

COPY . .
