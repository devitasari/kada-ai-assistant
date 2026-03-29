import express from "express";
import { chatRouter } from "./routes/chat.routes.js";

export const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "KADA AI Assistant API is running",
  });
});

app.use("/api/chat", chatRouter);