# First build
FROM node:18.0-alpine

WORKDIR /usr/src/app
# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build

RUN npm run generate:prisma

RUN npm run migrate:production

EXPOSE 3000

CMD ["npm", "run", "start"]

