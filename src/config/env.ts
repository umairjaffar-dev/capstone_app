import dotenv from "dotenv";

// - env.ts file is used to load the .env variables into process.env
// - So for this we use dotenv library.

dotenv.config();

// Environmental Variable Centralization:
export const env = {
  port: Number(process.env.PORT ?? 4000),
  isProduction: (process.env.NODE_ENV ?? "development") === "production",
  nodeEnv: process.env.NODE_ENV ?? "development",
  logLevel: process.env.LOG_LEVEL ?? "info",
  databaseUrl: process.env.DATABASE_URL,
} as const;
