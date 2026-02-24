# ============================================
# Stage 1: Build the React application
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build for production (uses .env.production automatically)
RUN npm run build

# ============================================
# Stage 2: Serve with Nginx
# ============================================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
