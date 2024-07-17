FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
CMD npm run start:ci
