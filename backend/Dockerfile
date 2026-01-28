# Builder
FROM node:20-alpine as builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

# Production
FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --only=production

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]

