# syntax=docker/dockerfile:1
#
# Build the static site with Node/pnpm, then serve dist/ with Caddy.
# Final image contains only Caddy and the built files: no Node runtime.
# The build context is this directory (recica/), not the monorepo root.

FROM node:24-alpine AS build
WORKDIR /app
ENV CI=true
# pnpm version comes from the packageManager field in package.json.
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# Astro reads PUBLIC_* variables while building. Coolify passes build-time
# variables as --build-arg, so they must be declared here to reach `astro build`.
ARG PUBLIC_INDEXING_ENABLED=false
ARG PUBLIC_ANALYTICS_HOST=
ENV PUBLIC_INDEXING_ENABLED=$PUBLIC_INDEXING_ENABLED
ENV PUBLIC_ANALYTICS_HOST=$PUBLIC_ANALYTICS_HOST
RUN pnpm build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ > /dev/null || exit 1
