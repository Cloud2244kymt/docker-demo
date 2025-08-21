# ---- deps stage ----
FROM node:20-alpine AS deps
WORKDIR /app

# npm settings: stable + retries (helps on flaky networks)
ENV npm_config_update_notifier=false \
    npm_config_fund=false \
    npm_config_audit=false

# copy manifests first for better caching
COPY package*.json ./

# If lockfile exists, prefer reproducible installs. Otherwise fallback.
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi

# ---- runner stage ----
FROM node:20-alpine
WORKDIR /app

# copy app including node_modules from deps
COPY --from=deps /app /app
# then copy the rest of your sources
COPY . .

EXPOSE 3000
# ensure package.json has: "start": "node server.js"
CMD ["npm","start"]
