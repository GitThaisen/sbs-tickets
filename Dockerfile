FROM node:8

WORKDIR /usr/src/app

ARG NPM_TOKEN

COPY package*.json ./
COPY webpack*.js ./
COPY . .


RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > /usr/src/app/.npmrc
RUN npm install
RUN [ "npm", "run", "build:prod" ]

COPY build ./build

ENV MONGO_HOST=10.216.64.104
ENV MONGO_DATABASE=tickets

EXPOSE 80
CMD [ "npm", "start" ]