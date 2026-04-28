FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy bot source
COPY scripts/telegram-bot.ts ./scripts/
COPY tsconfig.json ./

CMD ["npx", "tsx", "scripts/telegram-bot.ts"]
