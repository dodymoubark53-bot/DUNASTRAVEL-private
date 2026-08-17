/**
 * env.js — Safe Environment Validation for Dunas Travel Frontend
 */

export const env = {
  apiUrl: (import.meta.env.VITE_API_URL || 'https://dunastravel-backend-seven.vercel.app').replace(/\/+$/, ''),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};

/**
 * Validates frontend environment config on application startup.
 */
export function validateEnv() {
  if (!env.apiUrl) {
    console.warn('[env] VITE_API_URL is undefined. Defaulting to http://localhost:5000');
  }
  
  // Ensure no sensitive private backend secrets are accidentally exposed on import.meta.env
  const forbiddenKeys = ['DATABASE_URL', 'NEON_DB_URI', 'JWT_SECRET', 'OPENAI_API_KEY'];
  for (const key of forbiddenKeys) {
    if (import.meta.env[key]) {
      console.error(`[env] SECURITY WARNING: Private key ${key} is exposed in public environment!`);
    }
  }
}

export default env;
