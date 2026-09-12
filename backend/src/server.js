import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";

dotenv.config();
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
// console.log(process.env.JWT_SECRET)

const app =
  express();

const PORT =
  process.env.PORT || 5000;

/* =========================================================
   DATABASE
   ========================================================= */

await connectDB();

/* =========================================================
   MIDDLEWARE
   ========================================================= */

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",

    credentials: true,
  })
);

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cookieParser()
);

/* =========================================================
   ROUTES
   ========================================================= */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/projects",
  projectRoutes
);

/* =========================================================
   HEALTH
   ========================================================= */

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      message:
        "DevDeploy backend is running.",
    });
  }
);

/* =========================================================
   SERVER
   ========================================================= */

app.listen(
  PORT,
  () => {
    console.log(
      `DevDeploy backend running on http://localhost:${PORT}`
    );
  }
);