import { Pool } from "pg";
import { env } from "../config/env";
import { logger } from "./logger";

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

pool.on("error", (err) => {
  logger.error({ err }, "Unexpected database error");
});
