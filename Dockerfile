FROM node:16-alpine as builder

RUN mkdir -p /usr/src/mitsy
WORKDIR /usr/src/mitsy

RUN apk add --no-cache tzdata && cp -r -f /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime

RUN apk update && apk upgrade
RUN apk add git python3 make g++

COPY . /usr/src/mitsy/
RUN npm install
RUN npx prisma generate

FROM node:16-alpine as runner

WORKDIR /usr/src/mitsy
COPY --from=builder /usr/src/mitsy /usr/src/mitsy

CMD ["npm", "run", "prod"]
