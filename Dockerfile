# First build
FROM node:18.0-alpine

WORKDIR /usr/src/app
# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
