FROM node:14.15-alpine

LABEL maintainer "linsms@gmail.com"

ADD ./front /home/node/app
WORKDIR /home/node/app
RUN yarn install
RUN yarn build
