FROM node:18-alpine AS builder-new

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

# COPY . .
# COPY  src  src
# COPY  public public
# COPY .env .env

# # RUN npm run build

# # FROM nginx:stable-alpine

# # COPY --from=builder-new /app/build /mnt/build/search
# # COPY --from=builder-new /app/build /mnt/build
# # COPY nginx /etc/nginx

# # CMD ["nginx", "-g", "daemon off;"]

