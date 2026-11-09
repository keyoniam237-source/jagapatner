FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY server.js accounts.json ./
USER node
EXPOSE 8080
CMD ["node", "server.js"]
