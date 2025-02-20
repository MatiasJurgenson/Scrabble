# Kood saadud https://khromov.se/dockerizing-your-sveltekit-applications-a-practical-guide/

FROM node:22-alpine AS builder
WORKDIR /
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22-alpine
WORKDIR /
COPY --from=builder /build build/
COPY --from=builder /node_modules node_modules/
COPY package.json .
COPY .env .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "-r", "dotenv/config", "build" ]
