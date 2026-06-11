import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

// I use helmet to add basic security headers to the API.
app.use(helmet());

// I allow the backend to accept JSON request bodies.
app.use(express.json());

// I enable CORS so the frontend can call this backend later.
app.use(cors());

// I use morgan so I can see incoming API requests during development.
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Privacy Verification Platform API is running",
  });
});

export default app;