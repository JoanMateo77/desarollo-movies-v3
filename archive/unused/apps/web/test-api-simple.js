/**
 * Script de prueba para verificar la API de IMDb
 * Ejecutar con: node test-api.js
 */

// Configuración de la API
// Importa dotenv usando ES Modules
import dotenv from 'dotenv';

// Carga las variables del .env
dotenv.config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;
const URL = 'https://imdb236.p.rapidapi.com/api/imdb/top250-movies';

async function testImdbApi() {
  console.log('🧪 Probando API de IMDb...');
  console.log('📡 URL:', URL);
  console.log('🔑 API Key:', RAPIDAPI_KEY?.substring(0, 10) + '...' || 'No definida');
  
  try {
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    });

    console.log('📊 Status:', response.status);
    console.log('📊 OK:', response.ok);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Éxito! Películas obtenidas:', data.length);
      console.log('🎬 Primera película:', data[0]?.primaryTitle || 'N/A');
      console.log('🎬 Géneros de la primera película:', data[0]?.genres || 'N/A');
      console.log('🎬 Rating:', data[0]?.averageRating || 'N/A');
    } else {
      const text = await response.text();
      console.log('❌ Error:', text);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }
}

// Ejecutamos la función de prueba
testImdbApi();
