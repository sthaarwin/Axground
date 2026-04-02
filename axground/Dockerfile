# Production-ready Dockerfile for Next.js app
FROM node:20-alpine AS builder
WORKDIR /app
# Ensure TLS root certificates are available so Next can fetch remote fonts/assets
RUN apk add --no-cache ca-certificates

# Install deps based on lockfile for reproducible installs
COPY package.json package-lock.json* ./
RUN npm ci --silent
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy built app and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
# Install only production deps (use `npm install --omit=dev` to avoid requiring a lockfile)
RUN apk add --no-cache ca-certificates && \
	npm install --omit=dev --no-audit --silent
EXPOSE 3000
CMD ["npm", "start"]
