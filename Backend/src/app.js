import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

const app = express();


const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev")); 


app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Too many requests, please wait a minute." },
  })
);

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok", time: new Date().toISOString() });
});


// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});


app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Something went wrong";

  if (err.code === "LIMIT_FILE_SIZE") {
    status = 413;
    message = "Screenshot too large (max 5 MB).";
  }

  if (status >= 500) console.error("Server error:", err);

  res.status(status).json({
    success: false,
    error: status >= 500 ? "Internal server error" : message,
  });
});

export default app;