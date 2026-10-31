# FLF CMS — image chạy thử / VPS
# Build cần ≥4 GiB RAM (GitHub Actions / Render / VPS). Máy xưởng ~1 GiB không build được.
FROM node:22.23.4-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
RUN apt-get update -qq \
  && apt-get install -y -qq --no-install-recommends ca-certificates python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
# Cần devDependencies (tsx) để seed lúc start
RUN npm ci --include=dev

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# DATABASE_URL / PAYLOAD_SECRET chỉ cần giá trị giả lúc build; runtime dùng env thật
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build \
    PAYLOAD_SECRET=build-time-secret-not-used-at-runtime-32chars \
    NEXT_PUBLIC_SERVER_URL=http://localhost:3000 \
    PREVIEW_MODE=true \
    NODE_ENV=production \
    NODE_OPTIONS=--max-old-space-size=6144
RUN npm run build

FROM base AS runner
RUN apt-get update -qq \
  && apt-get install -y -qq --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    PREVIEW_MODE=true

# Standalone Next server
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Seed runtime (tsx + nguồn)
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs scripts/start-preview.sh ./scripts/start-preview.sh
RUN chmod +x ./scripts/start-preview.sh

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=5 \
  CMD curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null || exit 1

CMD ["./scripts/start-preview.sh"]
