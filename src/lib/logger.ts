import pino from "pino";
import { env } from "../config/env";

export const logger = pino({
    level: env.logLevel,
    transport: env.isProduction ? undefined : {
        target: 'pino-pretty',
        options: {
            colorize: true,          // Adds color-coding to log levels
            translateTime: 'SYS:standard', // Human-readable timestamp format
            // ignore: 'pid,hostname', // Removes distracting process IDs and hostnames
        },
    }
});