FROM node:carbon-slim

# Create app directory
WORKDIR /git/excursions-api

# Install app dependencies
COPY package.json /git/excursions-api/
RUN npm install

# Bundle app source
COPY . /git/excursions-api/
RUN npm run prepublish

CMD [ "npm", "run", "runServer" ]