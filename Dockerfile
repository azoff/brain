FROM node:alpine

WORKDIR /app

ADD ./src /app/src
ADD ./static /app/static
ADD ./package.json /app/package.json
ADD ./package-lock.json /app/package-lock.json

RUN npm install

EXPOSE 3000

CMD src/index.js