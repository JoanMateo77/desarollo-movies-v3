/**
 * Jest Setup simplificado para tRPC
 * Compatible con Vercel
 */

// Variables de entorno para testing
process.env.RAPIDAPI_KEY = 'test-api-key'
process.env.RAPIDAPI_HOST = 'test-host'
process.env.RAPIDAPI_BASE_URL = 'https://test-api.com'

// Mock de fetch global
global.fetch = jest.fn()

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks()
})
