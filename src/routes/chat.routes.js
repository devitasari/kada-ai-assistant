import { Router } from "express";
import { handleChat, resetChatSession } from "../controllers/chat.controller.js";

export const chatRouter = Router();

chatRouter.post("/", handleChat);
chatRouter.post("/reset", resetChatSession);