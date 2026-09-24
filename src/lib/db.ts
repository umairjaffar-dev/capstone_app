import { Pool } from "pg";
import { env } from "../config/env";
import { logger } from "./logger";

export const pool = new Pool({
  connectionString: env.databaseUrl,
  connectionTimeoutMillis: 20_000,
});

pool.on("error", (err) => {
  logger.error({ err }, "Unexpected database error");
});
