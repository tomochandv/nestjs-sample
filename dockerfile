FROM node:18
WORKDIR /usr/app
COPY package*.json ./
COPY nodemon*.json ./
RUN npm install
COPY . ./
EXPOSE 3000
CMD ["npm", "run", "start:dev"]