#FROM node:12.18.2 AS build
FROM arm32v6/node:10.23-alpine AS build

ENV NODE_VERSION 12.18.2

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @angular/cli

RUN npm install
COPY . .
RUN npm run build

EXPOSE 80
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/dice-town-client /usr/share/nginx/html