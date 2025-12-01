FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000

ENV NODE_ENV production
ENV PORT 3000

CMD ["./node_modules/.bin/next", "start"]
