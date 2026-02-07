# --- build ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- production ----------
FROM nginx:alpine

# borrar config default de nginx
RUN rm /etc/nginx/conf.d/default.conf

# copiar build de Vite
COPY --from=build /app/dist /usr/share/nginx/html

# config mínima para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]