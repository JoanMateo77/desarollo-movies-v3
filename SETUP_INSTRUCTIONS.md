# 🚀 Instrucciones de Configuración

## 📋 **Configuración Requerida**

Para que la aplicación funcione correctamente, necesitas crear un archivo `.env.local` en la carpeta `apps/web/` con la siguiente configuración:

### 📁 **Crear archivo: `apps/web/.env.local`**

```env
# Configuración de RapidAPI para IMDb
RAPIDAPI_KEY=b75695d07emshb035ff8bc7be8a7p19025djsnff2398385c07
RAPIDAPI_HOST=imdb236.p.rapidapi.com
NODE_ENV=development
```

### 🔧 **Pasos para configurar:**

1. **Navegar a la carpeta del proyecto:**
   ```bash
   cd apps/web
   ```

2. **Crear el archivo `.env.local`:**
   ```bash
   # En Windows (PowerShell)
   New-Item -Path ".env.local" -ItemType File
   
   # En Windows (CMD)
   echo. > .env.local
   
   # En Mac/Linux
   touch .env.local
   ```

3. **Copiar el contenido** del bloque de código de arriba al archivo `.env.local`

4. **Guardar el archivo**

### ✅ **Verificar que funciona:**

Una vez configurado, ejecuta:

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
node test-api.js
```

## 🎯 **Resultado Esperado:**

- ✅ **Aplicación ejecutándose** en `http://localhost:3000` o `http://localhost:3001`
- ✅ **Top 250 películas** cargándose correctamente
- ✅ **Búsqueda funcionando** por título, director, actores
- ✅ **Filtros por género** operativos
- ✅ **Detalles de película** accesibles

## 🚨 **Solución de Problemas:**

### **Error: "Falta RAPIDAPI_KEY"**
- Verifica que el archivo `.env.local` existe en `apps/web/`
- Verifica que la API key está correcta
- Reinicia el servidor de desarrollo

### **Error: "Rate limit"**
- La API tiene límites de uso
- Espera unos minutos y vuelve a intentar
- Considera usar una API key premium para mayor límite

### **Error: "Port in use"**
- Otro proceso está usando el puerto 3000
- La aplicación se ejecutará en el puerto 3001 automáticamente
- O termina otros procesos de Node.js: `taskkill /f /im node.exe`

## 🎉 **¡Listo!**

Una vez configurado, tu aplicación de películas estará funcionando perfectamente con la nueva arquitectura implementada.
