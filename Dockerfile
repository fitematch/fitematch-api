FROM node:22-alpine3.23

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
