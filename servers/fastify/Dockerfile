FROM node:22.12.0-slim

WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .

CMD ["npm", "start"]