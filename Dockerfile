# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Khai báo các arguments (nếu bạn muốn truyền từ docker-compose lúc build)


COPY package*.json ./
RUN npm install
COPY . .

# Chạy build. (Lưu ý: Nếu bạn có file .env ở thư mục host, lệnh COPY . . đã copy file .env vào, Vite sẽ tự động nhận diện)
RUN npm run build

# Stage 2: Serve với Nginx
FROM nginx:alpine

# Copy kết quả build sang thư mục public của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy cấu hình Nginx để phục vụ điều hướng React Router (Single Page App)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
