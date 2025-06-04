import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { userRouter } from "@/api/user/userRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";

import { inboxRouter } from './api/inbox/inboxRouter';
import { nextActionRouter } from "@/api/nextAction/nextActionRouter";
import { projectRouter } from "@/api/project/projectRouter";
import { contextRouter } from "@/api/context/contextRouter";
import { botRouter  } from "@/bot/botRouter";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

app.get("/", (_req, res) => {
  res.send("🚀 API de Tareito funcionando correctamente.");
});

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter);
app.use('/inbox', inboxRouter);

// Swagger UI
app.use("/docs", openAPIRouter);

app.use("/next-action", nextActionRouter);
app.use("/project", projectRouter);
app.use("/context", contextRouter);

app.use("/bot",botRouter);


// Error handlers
app.use(errorHandler());

export { app, logger };
