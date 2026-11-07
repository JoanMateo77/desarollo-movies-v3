# 🚀 Instrucciones de Configuración

## 📋 **Configuración Requerida**

Para que la aplicación funcione correctamente, necesitas configurar las variables de entorno y las dependencias.

### 🔧 **Prerrequisitos**

- **Node.js 18+** - [Descargar aquí](https://nodejs.org/)
- **pnpm** - Gestor de paquetes (recomendado)
- **Cuenta de RapidAPI** - Para acceder a la API de IMDb

### 📁 **Crear archivo: `apps/web/.env.local`**

```env
# Configuración de RapidAPI para IMDb
RAPIDAPI_KEY=tu_rapidapi_key_aqui
RAPIDAPI_HOST=imdb236.p.rapidapi.com
RAPIDAPI_BASE_URL=https://imdb236.p.rapidapi.com/api/imdb
NODE_ENV=development
```

### 🔑 **Obtener API Key de RapidAPI**

1. **Registrarse en RapidAPI**: [https://rapidapi.com/](https://rapidapi.com/)
2. **Buscar "IMDb API"** en el marketplace
3. **Suscribirse al plan gratuito** (250 requests/día)
4. **Copiar la API Key** del dashboard
5. **Reemplazar** `tu_rapidapi_key_aqui` con tu clave real

### 🛠️ **Pasos para configurar:**

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd desarollo-movies-v3
   ```

2. **Instalar dependencias:**
   ```bash
   # Instalar pnpm si no lo tienes
   npm install -g pnpm
   
   # Instalar dependencias del proyecto
   pnpm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   # Navegar a la carpeta de la aplicación
   cd apps/web
   
   # Crear archivo de variables de entorno
   # En Windows (PowerShell)
   New-Item -Path ".env.local" -ItemType File
   
   # En Windows (CMD)
   echo. > .env.local
   
   # En Mac/Linux
   touch .env.local
   ```

4. **Editar el archivo `.env.local`:**
   ```bash
   # Abrir el archivo en tu editor favorito
   code .env.local
   # o
   notepad .env.local
   ```

5. **Copiar y pegar** el contenido del bloque de código de arriba
6. **Reemplazar** `tu_rapidapi_key_aqui` con tu API key real
7. **Guardar el archivo**

### ✅ **Verificar que funciona:**

```bash
# Desde la raíz del proyecto
pnpm dev

# O desde apps/web
cd apps/web
pnpm dev
```

### 🧪 **Test de la API:**

Si quieres probar la API directamente:

```bash
cd apps/web
node test-api-simple.js
```

## 🎯 **Resultado Esperado:**

- ✅ **Aplicación ejecutándose** en `http://localhost:3000` o `http://localhost:3001`
- ✅ **Top 250 películas** cargándose correctamente
- ✅ **Búsqueda funcionando** por título, director, actores
- ✅ **Filtros por género** operativos
- ✅ **Detalles de película** accesibles
- ✅ **Loading states** y **error handling** funcionando

## 🚨 **Solución de Problemas:**

### **Error: "Falta RAPIDAPI_KEY"**
```bash
# Verificar que el archivo existe
ls apps/web/.env.local

# Verificar contenido
cat apps/web/.env.local

# Reiniciar servidor
pnpm dev
```

### **Error: "Rate limit"**
- La API tiene límites de uso (250 requests/día en plan gratuito)
- Espera unos minutos y vuelve a intentar
- Considera usar una API key premium para mayor límite
- Verifica tu uso en el dashboard de RapidAPI

### **Error: "Port in use"**
```bash
# En Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# En Mac/Linux
lsof -ti:3000 | xargs kill -9

# O usar otro puerto
PORT=3001 pnpm dev
```

### **Error: "Module not found"**
```bash
# Limpiar cache y reinstalar
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### **Error: "TypeScript errors"**
```bash
# Verificar tipos
pnpm check-types

# Limpiar cache de TypeScript
rm -rf .next
pnpm dev
```

## 🔧 **Configuración Avanzada**

### **Variables de Entorno Adicionales**

```env
# apps/web/.env.local
RAPIDAPI_KEY=tu_rapidapi_key_aqui
RAPIDAPI_HOST=imdb236.p.rapidapi.com
RAPIDAPI_BASE_URL=https://imdb236.p.rapidapi.com/api/imdb
NODE_ENV=development

# Opcional: Configuración de puerto
PORT=3000

# Opcional: Configuración de cache
NEXT_PUBLIC_CACHE_TIME=3600000
```

### **Configuración de Desarrollo**

```bash
# Habilitar logging detallado
DEBUG=1 pnpm dev

# Ejecutar con Turbopack (más rápido)
pnpm dev --turbo

# Ejecutar en modo producción local
pnpm build
pnpm start
```

### **Configuración de Linting**

```bash
# Verificar linting
pnpm lint

# Arreglar errores automáticamente
pnpm lint --fix

# Verificar tipos
pnpm check-types
```

## 📊 **Verificación de Performance**

### **Métricas de Build**
```bash
# Build de producción
pnpm build

# Verificar tamaño del bundle
pnpm analyze

# Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

### **Monitoreo en Desarrollo**
```bash
# Verificar memoria
node --inspect-brk node_modules/.bin/next dev

# Profiling de performance
NODE_OPTIONS='--prof' pnpm dev
```

## 🎉 **¡Listo!**

Una vez configurado correctamente, tu aplicación de películas estará funcionando perfectamente con:

- ✅ **Arquitectura moderna** con Next.js 16 y tRPC
- ✅ **Type safety completo** con TypeScript
- ✅ **Performance optimizada** con React Query
- ✅ **UI responsiva** con Tailwind CSS y Radix UI
- ✅ **Manejo robusto de errores** y loading states

### **Próximos Pasos**
1. **Explorar la aplicación** y probar todas las funcionalidades
2. **Revisar la documentación** en `README.md` y `ARCHITECTURE.md`
3. **Personalizar** la aplicación según tus necesidades
4. **Desplegar** a producción cuando esté listo

---

**¿Necesitas ayuda?** Revisa la documentación completa en los archivos `.md` del proyecto.

