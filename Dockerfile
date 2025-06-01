# Build stage
FROM node:22-alpine as BUILD_IMAGE

WORKDIR /app

COPY package*.json ./
RUN npm install production

COPY . .
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine as final

# Copy built application files from the build stage
COPY --from=BUILD_IMAGE /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration if you have one
COPY infrastructure/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the web service
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]