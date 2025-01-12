FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production --silent && npm cache clean --force
COPY prisma ./prisma/
RUN npx prisma generate

FROM node:lts-alpine AS production
WORKDIR /usr/src/app
RUN apk add --no-cache openssl 
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma/
COPY . . 
EXPOSE 3000
USER node
CMD ["npm", "start"]