/**
 * Test Unitario Simplificado del Router tRPC - Movies
 * 
 * Test básico y funcional para el router de películas.
 * Compatible con Vercel y deployment.
 */

// Mock de los servicios antes de importar el router
jest.mock('@/lib/services/api.service', () => ({
  ApiService: {
    getTop250Movies: jest.fn()
  }
}))

jest.mock('@/lib/services/movie.service', () => ({
  MovieService: {
    transformImdbMovies: jest.fn(),
    filterMovies: jest.fn(),
    extractGenres: jest.fn(),
    findMovieById: jest.fn()
  }
}))

// Mock de superjson para evitar problemas de ESM
jest.mock('superjson', () => ({
  stringify: jest.fn((data) => JSON.stringify(data)),
  parse: jest.fn((data) => JSON.parse(data)),
  serialize: jest.fn((data) => ({ json: JSON.stringify(data), meta: {} })),
  deserialize: jest.fn((data) => JSON.parse(data.json))
}))

// Importar después de los mocks
import { moviesRouter } from '@/server/api/routers/movies'
import { ApiService } from '@/lib/services/api.service'
import { MovieService } from '@/lib/services/movie.service'

describe('Movies Router - tRPC', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getTop250', () => {
    it('debería retornar películas correctamente', async () => {
      // Datos de prueba
      const mockMovies = [
        {
          id: 'tt0111161',
          title: 'The Shawshank Redemption',
          year: '1994',
          director: 'Frank Darabont',
          rating: '9.3',
          poster: 'https://example.com/poster1.jpg',
          genre: 'Drama',
          type: 'movie'
        }
      ]

      // Configurar mocks
      ;(ApiService.getTop250Movies as jest.Mock).mockResolvedValue(mockMovies)
      ;(MovieService.transformImdbMovies as jest.Mock).mockReturnValue(mockMovies)

      // Crear caller para testing
      const caller = moviesRouter.createCaller({})

      // Ejecutar test
      const result = await caller.getTop250({})

      // Verificar resultado
      expect(result).toBeDefined()
      expect(result.movies).toEqual(mockMovies)
      expect(result.totalResults).toBe(1)
      expect(ApiService.getTop250Movies).toHaveBeenCalledTimes(1)
    })

    it('debería manejar errores correctamente', async () => {
      // Configurar mock para error
      ;(ApiService.getTop250Movies as jest.Mock).mockRejectedValue(new Error('API Error'))

      const caller = moviesRouter.createCaller({})

      // Verificar que lanza error
      await expect(caller.getTop250({})).rejects.toThrow()
    })
  })

  describe('getGenres', () => {
    it('debería retornar géneros correctamente', async () => {
      // Datos de prueba
      const mockGenres = ['Drama', 'Crime', 'Action']
      const mockMovies = [
        { id: '1', genre: 'Drama' },
        { id: '2', genre: 'Crime' }
      ]

      // Configurar mocks
      ;(ApiService.getTop250Movies as jest.Mock).mockResolvedValue(mockMovies)
      ;(MovieService.transformImdbMovies as jest.Mock).mockReturnValue(mockMovies)
      ;(MovieService.extractGenres as jest.Mock).mockReturnValue(mockGenres)

      const caller = moviesRouter.createCaller({})

      // Ejecutar test
      const result = await caller.getGenres()

      // Verificar resultado
      expect(result).toEqual(mockGenres)
      expect(MovieService.extractGenres).toHaveBeenCalledWith(mockMovies)
    })
  })

  describe('getMovieDetail', () => {
    it('debería retornar detalles de película correctamente', async () => {
      // Datos de prueba
      const mockMovie = {
        id: 'tt0111161',
        title: 'The Shawshank Redemption',
        year: '1994',
        director: 'Frank Darabont',
        rating: '9.3'
      }
      const mockMovies = [mockMovie]

      // Configurar mocks
      ;(ApiService.getTop250Movies as jest.Mock).mockResolvedValue(mockMovies)
      ;(MovieService.transformImdbMovies as jest.Mock).mockReturnValue(mockMovies)
      ;(MovieService.findMovieById as jest.Mock).mockReturnValue(mockMovie)

      const caller = moviesRouter.createCaller({})

      // Ejecutar test
      const result = await caller.getMovieDetail({ id: 'tt0111161' })

      // Verificar resultado
      expect(result).toEqual(mockMovie)
      expect(MovieService.findMovieById).toHaveBeenCalledWith(mockMovies, 'tt0111161')
    })

    it('debería manejar película no encontrada', async () => {
      // Configurar mocks
      ;(ApiService.getTop250Movies as jest.Mock).mockResolvedValue([])
      ;(MovieService.transformImdbMovies as jest.Mock).mockReturnValue([])
      ;(MovieService.findMovieById as jest.Mock).mockReturnValue(null)

      const caller = moviesRouter.createCaller({})

      // Verificar que lanza error
      await expect(caller.getMovieDetail({ id: 'tt9999999' })).rejects.toThrow()
    })
  })
})
