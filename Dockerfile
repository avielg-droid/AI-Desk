FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy bot source
COPY scripts/telegram-bot.ts ./scripts/
COPY tsconfig.json ./

CMD ["sh", "-c", "echo 'BOT_TOKEN set:' ${TELEGRAM_BOT_TOKEN:+yes} && npx tsx scripts/telegram-bot.ts"]
