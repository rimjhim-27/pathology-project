import "dotenv/config";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// Configure CORS based on environment
const corsOrigins = (() => {
  if (process.env.NODE_ENV === "production") {
    // In production, allow requests from the same origin
    // Render will serve the built client and API from the same domain
    return [
      process.env.RENDER_EXTERNAL_URL || "*",
      ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []),
    ];
  }
  // Development: allow localhost and 127.0.0.1 on various ports
  return ["http://localhost:5001", "http://127.0.0.1:5001", "http://localhost:5173"];
})();

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "development" ? 1000 : 100,
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
return;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on the configured port.
  // reusePort is not supported on Windows, so only enable it on non-Windows hosts.
  const port = Number(process.env.PORT || 5000);
  // In production (Render), bind to 0.0.0.0 to listen on all interfaces
  // In development, use localhost (127.0.0.1)
  const host = process.env.HOST || (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");
  const listenOptions: { port: number; host: string; reusePort?: boolean } = {
    port,
    host,
  };

  if (process.platform !== "win32") {
    listenOptions.reusePort = true;
  }

  server.listen(listenOptions, () => {
    const displayHost = host === "0.0.0.0" ? "0.0.0.0 (all interfaces)" : host;
    log(`✅ Server listening on ${displayHost}:${port}`);
    log(`📡 Environment: ${process.env.NODE_ENV}`);
    if (process.env.RENDER_EXTERNAL_URL) {
      log(`🌐 External URL: ${process.env.RENDER_EXTERNAL_URL}`);
    }
  });
})();
