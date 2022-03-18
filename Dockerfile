FROM python:3.7-alpine as bash
RUN apk add --update bash

FROM node:16 as base
WORKDIR /app
COPY package*.json ./
RUN npm i prettier -g
RUN npm install
COPY . .

FROM base as production
ENV NODE_PATH=./build
RUN npm run build