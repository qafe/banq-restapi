FROM node:6

MAINTAINER qafe

COPY package.json /

RUN npm install

COPY public /public/
COPY banq-restapi.js /
COPY db.json /

EXPOSE 3000

CMD node banq-restapi.js
