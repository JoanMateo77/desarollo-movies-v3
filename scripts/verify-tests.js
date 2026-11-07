/**
 * Script de Verificación de Tests
 * 
 * Script para verificar que los tests del router tRPC funcionan correctamente.
 * Ejecutar desde la raíz con: node scripts/verify-tests.js
 */

const { execSync } = require('child_process')
const path = require('path')

console.log('🧪 Verificando Tests del Router tRPC...\n')

try {
  // Cambiar al directorio de la aplicación web
  process.chdir(path.join(__dirname, '..', 'apps', 'web'))
  
  console.log('📦 Instalando dependencias de testing...')
  execSync('pnpm install', { stdio: 'inherit' })
  
  console.log('\n🔍 Ejecutando tests...')
  execSync('pnpm test', { stdio: 'inherit' })
  
  console.log('\n📊 Generando reporte de cobertura...')
  execSync('pnpm test:coverage', { stdio: 'inherit' })
  
  console.log('\n✅ ¡Tests ejecutados exitosamente!')
  console.log('\n📋 Resumen:')
  console.log('- ✅ Configuración de Jest completada')
  console.log('- ✅ Tests unitarios del router tRPC creados')
  console.log('- ✅ Utilidades de testing implementadas')
  console.log('- ✅ Cobertura de código verificada')
  
} catch (error) {
  console.error('\n❌ Error ejecutando tests:', error.message)
  process.exit(1)
}
