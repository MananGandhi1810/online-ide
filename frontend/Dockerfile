FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3000
USER node
ENTRYPOINT ["npx", "serve", "-d", "dist", "-l", "3000"]