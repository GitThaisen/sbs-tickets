FROM node:8

WORKDIR /usr/src/app

ARG NPM_TOKEN

COPY package*.json ./

RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > /usr/src/app/.npmrc
RUN npm ci --production

RUN npm build:prod

COPY build ./build

ENV MONGO_HOST=10.216.64.104
ENV MONGO_DATABASE=tickets



EXPOSE 80
CMD [ "npm", "start" ]