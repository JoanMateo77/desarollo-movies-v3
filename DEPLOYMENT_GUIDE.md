# 🚀 Guía de Despliegue - Explorador de Películas

## 📋 Resumen

Esta guía cubre todos los métodos de despliegue disponibles para la aplicación, desde desarrollo local hasta producción en la nube.

## 🎯 Opciones de Despliegue

### 1. **Vercel** (Recomendado)
### 2. **Netlify**
### 3. **Railway**
### 4. **Docker**
### 5. **VPS/Servidor propio**

---

## 🚀 Vercel (Recomendado)

### **Ventajas**
- ✅ Integración nativa con Next.js
- ✅ Deploy automático desde Git
- ✅ CDN global
- ✅ Variables de entorno fáciles
- ✅ Analytics incluido
- ✅ Preview deployments

### **Pasos para Desplegar**

#### 1. **Preparar el Repositorio**
```bash
# Asegurarse de que el código esté en Git
git add .
git commit -m "Preparar para despliegue"
git push origin main
```

#### 2. **Conectar con Vercel**
1. Ir a [vercel.com](https://vercel.com)
2. **Sign in** con GitHub/GitLab/Bitbucket
3. **Import Project** desde el repositorio
4. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`

#### 3. **Configurar Variables de Entorno**
En el dashboard de Vercel:
```
RAPIDAPI_KEY=tu_rapidapi_key_aqui
RAPIDAPI_HOST=imdb236.p.rapidapi.com
RAPIDAPI_BASE_URL=https://imdb236.p.rapidapi.com/api/imdb
NODE_ENV=production
```

#### 4. **Deploy**
```bash
# Deploy automático al hacer push
git push origin main

# O deploy manual
vercel --prod
```

#### 5. **Configuración Avanzada**
```json
// vercel.json
{
  "buildCommand": "cd apps/web && pnpm build",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "functions": {
    "apps/web/src/app/api/**/*.ts": {
      "runtime": "nodºejs18.x"
    }
  }
}
```

### **Comandos Vercel CLI**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod

# Ver logs
vercel logs

# Ver deployments
vercel ls
```

---

## 🌐 Netlify

### **Ventajas**
- ✅ Deploy automático
- ✅ Formularios y funciones
- ✅ CDN global
- ✅ Preview deployments

### **Pasos para Desplegar**

#### 1. **Configurar Build**
```toml
# netlify.toml
[build]
  base = "apps/web"
  command = "pnpm build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. **Conectar Repositorio**
1. Ir a [netlify.com](https://netlify.com)
2. **New site from Git**
3. Conectar repositorio
4. Configurar:
   - **Base directory**: `apps/web`
   - **Build command**: `pnpm build`
   - **Publish directory**: `.next`

#### 3. **Variables de Entorno**
En Netlify Dashboard:
```
RAPIDAPI_KEY=tu_rapidapi_key_aqui
RAPIDAPI_HOST=imdb236.p.rapidapi.com
RAPIDAPI_BASE_URL=https://imdb236.p.rapidapi.com/api/imdb
NODE_ENV=production
```

---

## 🚂 Railway

### **Ventajas**
- ✅ Deploy automático
- ✅ Base de datos incluida
- ✅ Variables de entorno fáciles
- ✅ Logs en tiempo real

### **Pasos para Desplegar**

#### 1. **Configurar Railway**
```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd apps/web && pnpm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 2. **Conectar Repositorio**
1. Ir a [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Seleccionar repositorio
4. Configurar variables de entorno

---

## 🐳 Docker

### **Dockerfile**
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
WORKDIR /app/apps/web
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### **Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - RAPIDAPI_KEY=${RAPIDAPI_KEY}
      - RAPIDAPI_HOST=${RAPIDAPI_HOST}
      - RAPIDAPI_BASE_URL=${RAPIDAPI_BASE_URL}
      - NODE_ENV=production
    volumes:
      - .:/app
      - /app/node_modules
```

### **Comandos Docker**
```bash
# Build image
docker build -t movie-explorer .

# Run container
docker run -p 3000:3000 \
  -e RAPIDAPI_KEY=tu_key \
  -e RAPIDAPI_HOST=imdb236.p.rapidapi.com \
  movie-explorer

# Docker Compose
docker-compose up -d
```

---

## 🖥️ VPS/Servidor Propio

### **Requisitos del Servidor**
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **Node.js**: 18+
- **RAM**: 1GB mínimo, 2GB recomendado
- **CPU**: 1 core mínimo, 2 cores recomendado
- **Disco**: 10GB mínimo

### **Configuración del Servidor**

#### 1. **Instalar Node.js**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

#### 2. **Instalar pnpm**
```bash
npm install -g pnpm
```

#### 3. **Clonar Repositorio**
```bash
git clone <tu-repositorio>
cd desarollo-movies-v3
pnpm install
```

#### 4. **Configurar Variables de Entorno**
```bash
# Crear archivo de variables
sudo nano /etc/environment

# Agregar variables
RAPIDAPI_KEY=tu_rapidapi_key_aqui
RAPIDAPI_HOST=imdb236.p.rapidapi.com
RAPIDAPI_BASE_URL=https://imdb236.p.rapidapi.com/api/imdb
NODE_ENV=production
```

#### 5. **Configurar PM2**
```bash
# Instalar PM2
npm install -g pm2

# Crear archivo de configuración
nano ecosystem.config.js
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'movie-explorer',
    script: 'apps/web/server.js',
    cwd: '/path/to/desarollo-movies-v3',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

#### 6. **Iniciar Aplicación**
```bash
# Build de producción
cd apps/web
pnpm build

# Iniciar con PM2
pm2 start ecosystem.config.js --env production

# Verificar estado
pm2 status
pm2 logs movie-explorer
```

#### 7. **Configurar Nginx**
```nginx
# /etc/nginx/sites-available/movie-explorer
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/movie-explorer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔧 Configuración de Producción

### **Variables de Entorno Requeridas**
```env
# Producción
NODE_ENV=production
RAPIDAPI_KEY=tu_rapidapi_key_aqui
RAPIDAPI_HOST=imdb236.p.rapidapi.com
RAPIDAPI_BASE_URL=https://imdb236.p.rapidapi.com/api/imdb

# Opcional
PORT=3000
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### **Optimizaciones de Producción**

#### 1. **Next.js Config**
```typescript
// next.config.ts
const nextConfig = {
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'ia.media-imdb.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 días
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}
```

#### 2. **Build Optimizations**
```bash
# Build con análisis
pnpm build
pnpm analyze

# Verificar bundle size
npx @next/bundle-analyzer
```

#### 3. **Performance Monitoring**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/next'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## 🔍 Verificación Post-Despliegue

### **Checklist de Verificación**

#### ✅ **Funcionalidad Básica**
- [ ] Aplicación carga correctamente
- [ ] Top 250 películas se muestran
- [ ] Búsqueda funciona
- [ ] Filtros por género funcionan
- [ ] Página de detalle funciona
- [ ] Navegación funciona

#### ✅ **Performance**
- [ ] Tiempo de carga < 3 segundos
- [ ] Imágenes se cargan correctamente
- [ ] No hay errores en consola
- [ ] Mobile responsive funciona

#### ✅ **SEO y Metadatos**
- [ ] Título de página correcto
- [ ] Meta description presente
- [ ] Open Graph tags
- [ ] Sitemap.xml (opcional)

#### ✅ **Seguridad**
- [ ] Variables de entorno no expuestas
- [ ] HTTPS habilitado
- [ ] Headers de seguridad configurados

### **Herramientas de Verificación**

#### 1. **Lighthouse Audit**
```bash
# Instalar Lighthouse
npm install -g lighthouse

# Ejecutar audit
lighthouse https://tu-dominio.com --view
```

#### 2. **GTmetrix**
- Ir a [gtmetrix.com](https://gtmetrix.com)
- Ingresar URL de la aplicación
- Revisar métricas de performance

#### 3. **WebPageTest**
- Ir a [webpagetest.org](https://webpagetest.org)
- Probar desde diferentes ubicaciones
- Revisar Core Web Vitals

---

## 🚨 Solución de Problemas

### **Problemas Comunes**

#### 1. **Build Falla**
```bash
# Verificar logs
vercel logs
# o
pm2 logs movie-explorer

# Limpiar cache
rm -rf .next node_modules
pnpm install
pnpm build
```

#### 2. **Variables de Entorno No Funcionan**
```bash
# Verificar variables
vercel env ls
# o
pm2 show movie-explorer

# Reiniciar aplicación
vercel --prod
# o
pm2 restart movie-explorer
```

#### 3. **API No Responde**
- Verificar API key de RapidAPI
- Revisar límites de rate
- Verificar conectividad de red

#### 4. **Imágenes No Cargan**
- Verificar configuración de `next.config.ts`
- Revisar `remotePatterns`
- Verificar URLs de imágenes

### **Logs y Debugging**

#### Vercel
```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver logs de función específica
vercel logs --function=api/trpc
```

#### PM2
```bash
# Ver logs
pm2 logs movie-explorer

# Ver logs en tiempo real
pm2 logs movie-explorer --lines 100

# Monitorear recursos
pm2 monit
```

---

## 📊 Monitoreo y Mantenimiento

### **Métricas Importantes**
- **Uptime**: Disponibilidad de la aplicación
- **Response Time**: Tiempo de respuesta
- **Error Rate**: Porcentaje de errores
- **Memory Usage**: Uso de memoria
- **CPU Usage**: Uso de CPU

### **Herramientas de Monitoreo**

#### 1. **Vercel Analytics**
- Incluido automáticamente
- Métricas de Core Web Vitals
- Análisis de tráfico

#### 2. **PM2 Monitoring**
```bash
# Dashboard web
pm2 plus

# Monitoreo local
pm2 monit
```

#### 3. **Uptime Monitoring**
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://pingdom.com)
- [StatusCake](https://statuscake.com)

---

## 🔄 CI/CD Pipeline

### **GitHub Actions**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: cd apps/web && pnpm build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### **Variables de GitHub Secrets**
```
VERCEL_TOKEN=tu_vercel_token
ORG_ID=tu_org_id
PROJECT_ID=tu_project_id
```

---

## 🎉 Conclusión

La aplicación está lista para producción con:

- ✅ **Múltiples opciones de despliegue**
- ✅ **Configuración optimizada**
- ✅ **Monitoreo y debugging**
- ✅ **CI/CD pipeline**
- ✅ **Documentación completa**

### **Recomendación Final**
Para la mayoría de casos, **Vercel** es la opción más sencilla y eficiente para desplegar aplicaciones Next.js, especialmente para proyectos que no requieren infraestructura compleja.

---

**¿Necesitas ayuda?** Revisa la documentación específica de cada plataforma o consulta los logs de error para diagnosticar problemas.

---

**Última actualización**: Diciembre 2024
