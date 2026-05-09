# ETAPA 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./
RUN npm install
# Copiamos el resto del código y generamos la carpeta 'dist'
COPY . .
RUN npm run build

# ETAPA 2: Servidor de producción (Nginx)
FROM nginx:stable-alpine

# Copiamos nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos estáticos generados en la etapa 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
