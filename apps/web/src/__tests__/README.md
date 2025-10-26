# 🧪 Tests Unitarios - Router tRPC

Tests simplificados y funcionales para el router tRPC de películas.

## 🚀 Ejecutar Tests

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch

# Ejecutar tests con cobertura
pnpm test:coverage
```

## 📊 Tests Implementados

### ✅ **5 Casos de Prueba**

1. **getTop250** - Retornar películas correctamente
2. **getTop250** - Manejar errores correctamente  
3. **getGenres** - Retornar géneros correctamente
4. **getMovieDetail** - Retornar detalles de película
5. **getMovieDetail** - Manejar película no encontrada

## 🛠️ Configuración

- **Jest**: Configuración simplificada con ts-jest
- **Mocks**: Servicios completamente mockeados
- **Compatibilidad**: Funciona en Vercel y deployment
- **Sin dependencias externas**: Solo Jest y TypeScript

## 📁 Archivos

- `movies.test.ts` - Tests del router tRPC
- `jest.config.js` - Configuración de Jest
- `jest.setup.js` - Setup global

## ✅ **Resultado**

```
Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Time:        ~6s
```

---

**¡Tests funcionando correctamente!** 🎉
