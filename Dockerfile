FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY frontend/package*.json ./
RUN npm ci

FROM base AS builder
ARG NEXT_PUBLIC_API_BASE_URL=/api
ARG NEXT_PUBLIC_BULK_ORDER_URL=/api/bulk-order
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_BULK_ORDER_URL=${NEXT_PUBLIC_BULK_ORDER_URL}
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./
COPY cms/public/virteez ./public/virteez

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]