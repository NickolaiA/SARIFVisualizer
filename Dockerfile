# Multi-stage Dockerfile for building and serving the Vite React app
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
# copy TypeScript and Vite configs required for the build
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY vite.config.ts postcss.config.js tailwind.config.js eslint.config.js ./
COPY index.html ./
COPY public ./public
COPY src ./src
RUN npm ci --prefer-offline --no-audit --progress=false
RUN npm run build

# Production stage - use nginx to serve built assets
FROM nginx:stable-alpine AS production
RUN apk add --no-cache curl
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config to serve on port 80 and support SPA fallback
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Healthcheck uses curl to ensure nginx serves index.html on port 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -fsS http://localhost:80/ || exit 1

CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]
