import fs from "fs";
import winston from "winston";

const fsPromise = fs.promises;

// 1. Configure winston logger.
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-logging" },
  transports: [
    // - Write to all logs with level `info` and below to `combined.log`.
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

const loggerMiddleware = async (req, res, next) => {
  // 1. Log request body.
  if (!req.url.includes("user")) {
    const logData = `${req.url} - ${JSON.stringify(req.body)} `;
    logger.info(logData);
  }
  next();
};

export default loggerMiddleware;
