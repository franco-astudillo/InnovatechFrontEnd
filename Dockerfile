# ETAPA 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app

# --- AGREGAR ESTO: Declarar las variables que Vite necesita ---
ARG VITE_API_BASE_URL
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

COPY package*.json ./
RUN npm install
COPY . .

# Vite leerá los ARG de arriba y los inyectará en el código compilado
RUN npm run build

# ETAPA 2: Servidor (Nginx)
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]