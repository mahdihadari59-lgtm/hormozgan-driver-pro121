FROM node:18-alpine

WORKDIR /app

# نصب وابستگی‌ها
COPY package*.json ./
RUN npm ci --only=production

# کپی کد
COPY . .

# تنظیمات بهینه Node.js
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=3072"

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server-v8.js"]
