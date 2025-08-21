# ---- build (install deps) ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

# ---- runtime ----
FROM node:20-alpine
WORKDIR /app
COPY --from=deps /app /app
EXPOSE 3000
CMD ["npm","start"]
