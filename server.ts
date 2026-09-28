import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google Gen AI client if key exists
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({});
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Dynamic OTT Streaming Availability Endpoint
app.post('/api/streaming-availability', async (req, res) => {
  const { title, year, type, region = 'US' } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  // If no Gemini client, return null so frontend uses default curated resolver
  if (!aiClient || !process.env.GEMINI_API_KEY) {
    return res.json({
      fallback: true,
      message: 'GEMINI_API_KEY not configured, using verified local streaming catalog.',
    });
  }

  try {
    const ottSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        stream: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platformId: { type: Type.STRING },
              name: { type: Type.STRING },
              logo: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['stream'] },
              price: { type: Type.STRING },
              quality: { type: Type.STRING },
              url: { type: Type.STRING },
            },
            required: ['platformId', 'name', 'type', 'url'],
          },
        },
        rent: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platformId: { type: Type.STRING },
              name: { type: Type.STRING },
              logo: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['rent'] },
              price: { type: Type.STRING },
              quality: { type: Type.STRING },
              url: { type: Type.STRING },
            },
            required: ['platformId', 'name', 'type', 'url'],
          },
        },
        buy: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platformId: { type: Type.STRING },
              name: { type: Type.STRING },
              logo: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['buy'] },
              price: { type: Type.STRING },
              quality: { type: Type.STRING },
              url: { type: Type.STRING },
            },
            required: ['platformId', 'name', 'type', 'url'],
          },
        },
        availabilityNotes: { type: Type.STRING },
      },
      required: ['stream', 'rent', 'buy'],
    };

    const prompt = `You are a film streaming availability engine for CineScope.
Determine current real OTT streaming, rental, and purchase availability for:
Title: "${title}"
Release Year: ${year || 'Any'}
Content Type: ${type || 'Movie or Series'}
Region: "${region}" (e.g. US, GB, CA, AU, IN, DE).

Platforms commonly include: Netflix, Prime Video, Disney+, Apple TV, Max, Hulu, Paramount+, Peacock, YouTube Movies, Google Play.
For each platform, provide:
- platformId (e.g. 'netflix', 'prime_video', 'disney_plus', 'apple_tv', 'max', 'youtube', 'hulu', 'paramount_plus', 'peacock')
- name (display name)
- type ('stream' for subscription/free, 'rent' for rental, 'buy' for purchase)
- price (e.g. "Subscription", "$3.99", "$14.99", "Free with Ads")
- quality (e.g. "4K UHD", "HD", "Dolby Vision")
- url: Generate direct link to the movie or search link on that platform, e.g.:
  * Netflix: "https://www.netflix.com/search?q=${encodeURIComponent(title)}"
  * Prime Video: "https://www.amazon.com/s?k=${encodeURIComponent(title)}&i=instant-video"
  * Disney+: "https://www.disneyplus.com/search?q=${encodeURIComponent(title)}"
  * Apple TV: "https://tv.apple.com/search?term=${encodeURIComponent(title)}"
  * Max: "https://www.max.com/search?q=${encodeURIComponent(title)}"
  * YouTube: "https://www.youtube.com/results?search_query=${encodeURIComponent(title)}+movie"

If the movie is not available for streaming in this region on a platform, DO NOT include that platform.
Return valid JSON.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: ottSchema,
        temperature: 0.1,
      },
    });

    const text = response.text;
    if (!text) {
      return res.json({ fallback: true });
    }

    const data = JSON.parse(text);
    return res.json({ success: true, region, data });
  } catch (error: any) {
    console.error('Error fetching streaming availability:', error);
    return res.json({ fallback: true, error: error.message });
  }
});

// Dynamic AI Movie Search / Details Lookup
app.post('/api/movies/ai-lookup', async (req, res) => {
  const { query, type = 'all', region = 'US' } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  if (!aiClient || !process.env.GEMINI_API_KEY) {
    return res.json({ fallback: true });
  }

  try {
    const movieSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        year: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['movie', 'tv', 'series'] },
        posterUrl: { type: Type.STRING },
        rating: { type: Type.NUMBER },
        metascore: { type: Type.NUMBER },
        duration: { type: Type.STRING },
        genres: { type: Type.ARRAY, items: { type: Type.STRING } },
        director: { type: Type.STRING },
        cast: { type: Type.ARRAY, items: { type: Type.STRING } },
        plot: { type: Type.STRING },
        language: { type: Type.STRING },
        awards: { type: Type.STRING },
        released: { type: Type.STRING },
        rated: { type: Type.STRING },
      },
      required: [
        'id',
        'title',
        'year',
        'type',
        'rating',
        'duration',
        'genres',
        'director',
        'cast',
        'plot',
        'language',
        'awards',
        'rated',
      ],
    };

    const prompt = `Lookup accurate film/series metadata for: "${query}".
Category filter: "${type}".
Return valid JSON adhering to the schema.
For posterUrl, provide a verified Wikipedia or IMDb Wikimedia image URL or high-quality movie poster URL.
Language: English, Rated: e.g. PG-13, R, TV-MA.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: movieSchema,
        temperature: 0.2,
      },
    });

    const text = response.text;
    if (!text) {
      return res.json({ fallback: true });
    }
    const movieData = JSON.parse(text);
    return res.json({ success: true, movie: movieData });
  } catch (error: any) {
    console.error('Error during AI movie lookup:', error);
    return res.json({ fallback: true, error: error.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CineScope server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start CineScope server:', err);
  process.exit(1);
});
