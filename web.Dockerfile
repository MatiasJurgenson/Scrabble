# Kood saadud https://khromov.se/dockerizing-your-sveltekit-applications-a-practical-guide/


### jooksutamine
# docker build -f web.Dockerfile -t scrabble .
# docker run -dit -p 3000:3000 --name scrabble scrabble

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
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]
