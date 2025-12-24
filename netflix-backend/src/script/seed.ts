// src/scripts/seed.ts
import axios from 'axios';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ContentService } from '../content/content.service';

const TMDB_KEY = 'f8707136961bdd17962e12cca6706b53'; // Replace this!
const BASE_URL = 'https://api.themoviedb.org/3';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const contentService = app.get(ContentService);

  console.log('🌱 Starting Seeding Process...');

  // 1. Fetch Trending Movies
  const response = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${TMDB_KEY}`);
  const movies = response.data.results;

  for (const movie of movies) {
    console.log(`Processing: ${movie.title}`);
    
    // Map TMDB data to Our Schema
    const contentData = {
      title: movie.title,
      description: movie.overview,
      thumbnailUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      backdropUrl: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
      type: 'movie',
      genre: 'Trending', // Simplification
      ageRating: movie.adult ? '18+' : '12+',
      trailerUrl: 'https://www.youtube.com/watch?v=dummy', // TMDB requires a separate call for trailers
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Dummy video
    };

    // Save to DB (using the service we already built!)
    try {
      await contentService.create(contentData as any);
    } catch (e) {
      console.log(`Skipped duplicate: ${movie.title}`);
    }
  }

  console.log('✅ Seeding Complete!');
  await app.close();
}

bootstrap();