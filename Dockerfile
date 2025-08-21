# ---- deps stage ----
FROM node:20-alpine AS deps
WORKDIR /app

ENV npm_config_update_notifier=false \
    npm_config_fund=false \
    npm_config_audit=false

COPY package*.json ./

# use ci if a lockfile exists; otherwise install
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi

# ---- runner ----
FROM node:20-alpine
WORKDIR /app
COPY --from=deps /app /app
COPY . .

EXPOSE 3000
CMD ["npm","start"]
