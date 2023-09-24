FROM node:18.18-alpine

RUN mkdir app

WORKDIR /app

COPY . /app

RUN npm install

CMD ["npm", "start"]
