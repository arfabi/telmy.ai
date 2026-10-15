# ==========================================
# Stage 1: Build Modern React Frontend (Vite + Tailwind + Shadcn)
# ==========================================
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Express Server & Unified Production Runner
# ==========================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/src ./src
COPY backend/public ./public

# Salin output kompilasi React Vite ke folder public Express
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 8080

CMD ["node", "src/index.js"]
