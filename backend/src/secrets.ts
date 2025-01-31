import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  DATABASE_URL: string;
  JWT_SECRET_REFRESH_TOKEN: string;
  JWT_SECRET_ACCESS_TOKEN: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  CORS_ORIGIN: string;
  PORT: number
}

// Validate and export environment variables
const getEnvVariable = (key: keyof EnvConfig): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const config: EnvConfig = {
  DATABASE_URL: getEnvVariable('DATABASE_URL'),
  JWT_SECRET_REFRESH_TOKEN: getEnvVariable('JWT_SECRET_REFRESH_TOKEN'),
  JWT_SECRET_ACCESS_TOKEN: getEnvVariable('JWT_SECRET_ACCESS_TOKEN'),
  GOOGLE_CLIENT_ID: getEnvVariable("GOOGLE_CLIENT_ID"),
  CORS_ORIGIN: getEnvVariable("CORS_ORIGIN"),
  PORT: parseInt(getEnvVariable("PORT")),

  GOOGLE_CLIENT_SECRET: getEnvVariable("GOOGLE_CLIENT_SECRET")
};