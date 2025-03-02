FROM node:20-alpine3.19

# Installs Chromium (100) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies (including Puppeteer)
RUN npm install --omit=dev

# Copy application files
COPY server.js .

# Expose the Puppeteer middleware port
EXPOSE 3005

# Set environment variables with default values
ENV PORT=3005
ENV TARGET_URL="http://localhost:4200"

# Start the Puppeteer middleware
CMD ["node", "server.js"]
