# ==== CONFIGURE =====
FROM node:19-alpine as builder
WORKDIR /app
COPY . .
# ==== BUILD =====
ARG SUPABASE_URL
ARG SUPABASE_KEY
ENV REACT_APP_SB_URL=$SUPABASE_URL \
    REACT_APP_SB_KEY=$SUPABASE_KEY
RUN npm ci 
RUN npm run build

# ==== CONFIGURE =====
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# ==== RUN =====
CMD ["nginx", "-g", "daemon off;"]