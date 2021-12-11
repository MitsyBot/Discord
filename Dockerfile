FROM node:16-alpine
LABEL org.opencontainers.image.source=https://github.com/MitsyBot/Mitsy

RUN mkdir -p /usr/src/mitsy
WORKDIR /usr/src/mitsy

RUN apk update && apk upgrade
RUN apk add git

COPY . /usr/src/mitsy/
RUN npm install
