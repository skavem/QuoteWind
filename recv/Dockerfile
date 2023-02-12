# ==== CONFIGURE =====
FROM node:19-alpine as builder
LABEL stage=builder
WORKDIR /app
COPY . .
# ==== BUILD =====
ARG SUPABASE_URL
ARG SUPABASE_KEY
ARG DEFAULT_FONT_SIZE
ARG MIN_FONT_SIZE
ENV REACT_APP_SB_URL=$SUPABASE_URL \
    REACT_APP_SB_KEY=$SUPABASE_KEY \
    REACT_APP_DEFAULT_FONT_SIZE=$DEFAULT_FONT_SIZE \
    REACT_APP_MIN_FONT_SIZE=$MIN_FONT_SIZE
RUN npm ci 
RUN npm run build

# ==== CONFIGURE =====
FROM nginx:1.23.3-alpine as production
LABEL app=quotewind
ENV NODE_ENV production
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# ==== RUN =====
CMD ["nginx", "-g", "daemon off;"]