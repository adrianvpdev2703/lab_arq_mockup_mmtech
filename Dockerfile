# ==========================================
# Etapa 1: Construcción (Builder)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de definición de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias limpias
RUN npm ci

# Copiar el código fuente completo
COPY . .

# Compilar la aplicación React + TypeScript con Vite
RUN npm run build

# ==========================================
# Etapa 2: Servidor Web de Producción (Nginx)
# ==========================================
FROM nginx:alpine AS runner

# Copiar configuración personalizada de Nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los artefactos estáticos compilados desde el builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto estándar HTTP
EXPOSE 80

# Iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
