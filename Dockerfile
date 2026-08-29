FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY nuxt.config.ts tsconfig.json ./
COPY app/ app/
COPY server/ server/
COPY shared/ shared/
COPY public/ public/

ARG NUXT_CRM_PUBLIC_PRICELIST_URL
ARG NUXT_CRM_LEADS_URL
ARG NUXT_CRM_LEADS_KEY
ARG NUXT_DIRECTUS_URL
ARG NUXT_PUBLIC_SITE_URL

RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN addgroup -S revive && adduser -S revive -G revive
COPY --from=build --chown=revive:revive /app/.output/ ./
USER revive

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
