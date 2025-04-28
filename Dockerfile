# === 1. Build Stage ===
FROM node:latest AS builder

WORKDIR /app

# Copy Prisma schema early so postinstall works
COPY prisma prisma

# Copy dependencies files
COPY package.json package-lock.json ./

# Install all dependencies (includes postinstall)
RUN npm install

# Copy the rest of the app
COPY . .

# Build Next.js
RUN npm run build

# === 2. Production Image ===
FROM node:latest AS runner

ENV NODE_ENV=production
WORKDIR /app

# Copy Prisma schema early so postinstall works
COPY prisma prisma
COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/prisma prisma
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.env ./
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["npm", "start"]
