import "dotenv/config";
import express from "express";
import { pool } from "./db.js";
import { authRouter } from "./routes/auth.js";
import { postersRouter } from "./routes/posters.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(express.json()); // parses incoming requests with JSON payloads
app.use(cookieParser()); // reads incoming cookies and makes them available later on:

// logger middleware
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get("/health", async (_req, res) => {
  const result = await pool.query("SELECT now() AS now");

  res.json({
    status: "ok",
    service: "marketing-content-generator-api",
    database: {
      status: "connected",
      now: result.rows[0].now,
    },
  });
});

app.use("/api/auth", authRouter);
app.use("/api/posters", postersRouter);

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
