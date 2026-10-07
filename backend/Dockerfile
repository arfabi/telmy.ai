FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./

RUN npm ci --only=production

COPY src ./src

EXPOSE 8080

CMD ["node", "src/index.js"]
