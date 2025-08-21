# ---- deps stage: install server deps
FROM node:20-alpine AS deps
WORKDIR /app
ENV npm_config_update_notifier=false npm_config_fund=false npm_config_audit=false

# server deps
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# ---- client stage: build React
FROM node:20-alpine AS clientbuild
WORKDIR /client
ENV npm_config_update_notifier=false npm_config_fund=false npm_config_audit=false
COPY client/package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY client/ ./
RUN npm run build

# ---- runtime image
FROM node:20-alpine
WORKDIR /app
# bring server deps
COPY --from=deps /app /app
# bring server source
COPY server.js ./
# bring built React assets into /app/public
RUN mkdir -p public
COPY --from=clientbuild /client/build/ /app/public/

EXPOSE 3000
CMD ["node","server.js"]
