ARG NODE_IMAGE=node:16.13.1-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node . .

FROM dependencies AS build
RUN node ace build --production

FROM base AS production
ENV PORT=$PORT
ENV HOST=$HOST
ENV NODE_ENV=$NODE_ENV
ENV APP_KEY=$APP_KEY
ENV DRIVE_DISK=$DRIVE_DISK

ENV DB_CONNECTION=$DB_CONNECTION
ENV PG_HOST=$PG_HOST
ENV PG_PORT=$PG_PORT
ENV PG_USER=$PG_USER
ENV PG_PASSWORD=$PG_PASSWORD
ENV PG_DB_NAME=$PG_DB_NAME
ENV PG_SSL=$PG_SSL


COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node --from=build /home/node/app/build .
EXPOSE $PORT

RUN node ace migration:run --force
RUN node ace db:seed --force
CMD [ "dumb-init", "node", "server.js" ]
