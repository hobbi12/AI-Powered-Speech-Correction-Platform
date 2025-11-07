# استخدم Node 20 بدل 18
FROM node:20-alpine

WORKDIR /app

# نسخ ملفات package.json أولاً
COPY package*.json ./

# إصلاح مشاكل SSL والشبكة داخل Docker
RUN npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-timeout 600000 \
    && npm config set registry https://registry.npmjs.org/ \
    && npm install

# نسخ باقي الملفات
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
