FROM node:alpine
COPY . /app
WORKDIR /app
EXPOSE 443
CMD node app.js
