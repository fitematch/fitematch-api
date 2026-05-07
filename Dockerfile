FROM node:24.15.0-alpine AS development
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
RUN npm install -g npm@latest \
  && npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]


FROM node:24.15.0-slim AS builder
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
RUN npm install -g npm@latest \
  && npm ci
COPY . .
RUN npm run build


FROM node:24.15.0-slim AS production
WORKDIR /app
ENV NODE_ENV=production
ENV TZ=America/Sao_Paulo
COPY package*.json ./
RUN npm install -g npm@latest \
  && npm ci --omit=dev --ignore-scripts \
  && npm cache clean --force
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]