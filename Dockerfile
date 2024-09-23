#Base image for Bun.js
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./

ARG NODE_ENV
ARG APP_PORT

ARG MONGODB_URI

ENV NODE_ENV=$NODE_ENV
ENV APP_PORT=$APP_PORT

ENV MONGODB_URI=$MONGODB_URI

RUN bun install

COPY . .

EXPOSE ${APP_PORT}

CMD ["bun", "dev"]

