# --- Etapa 1: build ---
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY ./ ./
RUN npm run build
RUN npm prune --omit=dev
FROM node:24-alpine
WORKDIR /app
RUN apk upgrade --no-cache
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app/package*.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
CMD ["node", "dist/server/entry.mjs"]