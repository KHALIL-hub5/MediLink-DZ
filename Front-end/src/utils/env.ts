import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('MediLink DZ'),
  VITE_API_BASE_URL: z.string().url().default('http://localhost:8000/api'),
});

export const env = envSchema.parse({
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
});
