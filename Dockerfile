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

# ---- Base ----
    FROM node:18-alpine AS base
    WORKDIR /app
    
    # Install Prisma CLI globally in the base stage if needed for more complex scripts
    # RUN npm install -g prisma
    
    # ---- Dependencies ----
    FROM base AS deps
    COPY package.json package-lock.json ./
    RUN npm ci
    
    # ---- Builder ----
    FROM base AS builder
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    # Generate Prisma Client - Ensure your schema.prisma is present
    # This environment variable is crucial if your schema relies on it during generation
    ARG DATABASE_URL
    ENV DATABASE_URL=${DATABASE_URL}
    RUN npx prisma generate
    
    # Build Next.js app
    # Ensure NEXT_PUBLIC_ variables are available during build if needed
    # ARG NEXT_PUBLIC_API_URL
    # ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    RUN npm run build
    
    # ---- Runner ----
    FROM node:18-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    # If you have a different user/group on your VPS, adjust accordingly
    # RUN addgroup --system --gid 1001 nodejs
    # RUN adduser --system --uid 1001 nextjs
    
    # Copy standalone output
    COPY --from=builder /app/.next/standalone ./
    COPY --from=builder /app/.next/static ./.next/static
    COPY --from=builder /app/public ./public
    
    # Copy Prisma schema and migration files for runtime migrations
    COPY --from=builder /app/prisma ./prisma
    # Copy generated Prisma client (if not already in standalone output - check your Next.js version behavior)
    # Make sure the path matches your `output` in schema.prisma
    COPY --from=builder /app/prisma/generated/client ./prisma/generated/client
    # If your prisma client is in node_modules after build with standalone, this might not be needed or path needs adjustment
    # COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma # Example if client is within node_modules
    
    # Copy package.json in case the start script relies on it, or for Prisma CLI at runtime
    COPY --from=builder /app/package.json ./package.json
    # Reinstall only production Prisma dependencies if needed for `prisma migrate deploy`
    # RUN npm install --omit=dev @prisma/client pg
    
    EXPOSE 3000
    
    # Set user (optional but recommended for security)
    # USER nextjs
    
    # This command will:
    # 1. Apply pending database migrations
    # 2. Start the Next.js application
    # Ensure `DATABASE_URL` is available in the runtime environment
    CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
   