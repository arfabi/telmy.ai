FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY backend/package*.json ./

RUN npm ci --only=production

COPY backend/src ./src
COPY backend/public ./public

EXPOSE 8080

CMD ["node", "src/index.js"]
