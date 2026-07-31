import axios from 'axios';

import { env } from '@/utils/env';

export const httpClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
