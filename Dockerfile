FROM node:carbon-slim

# Create app directory
WORKDIR /git/excursions-app-api

# Install app dependencies
COPY package.json /git/excursions-app-api/
RUN npm install

# Bundle app source
COPY . /git/excursions-app-api/
RUN npm run prepublish

CMD [ "npm", "run", "runServer" ]