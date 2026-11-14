import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import authRoutes from "./routes/auth.route.js";
import analyzeRoutes from "./routes/analyze.routes.js";
import caseFileRoutes from "./routes/caseFile.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, "../../Frontend/dist");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Security headers (relaxed CSP so React SPA and media previews render smoothly)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., same-origin browser fetches, mobile apps, curl)
      if (!origin) return callback(null, true);
      if (!allowedOrigins.length || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// Rate limiter for API routes
app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Too many requests, please wait a minute." },
  })
);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok", time: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/casefile", caseFileRoutes);

// API 404 handler for unmatched /api/* calls
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, error: "API endpoint not found" });
});

// Serve Frontend build in production / single-service deployment
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  // SPA fallback for all non-API GET requests
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  // If dist not built yet, fallback handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: "Frontend build not found. Run 'npm run build' first.",
    });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Something went wrong";

  if (err.code === "LIMIT_FILE_SIZE") {
    status = 413;
    message = "Uploaded file too large (max 5 MB).";
  }

  if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
    status = 400;
    message = "Upload at most one screenshot and one audio file.";
  }

  if (status >= 500) console.error("Server error:", err);

  res.status(status).json({
    success: false,
    error: status >= 500 ? "Internal server error" : message,
  });
});

export default app;
