import { chatService } from "../services/chat.service.js";
import { validateChatPayload, validateResetPayload } from "../validators/chat.validator.js";
import { successResponse, errorResponse } from "../utils/response.js";

export async function handleChat(req, res) {
  try {
    const { sessionId, message } = validateChatPayload(req.body);

    const result = await chatService.processMessage({
      sessionId,
      message,
    });

    return res.status(200).json(successResponse(result));
  } catch (error) {
    return res.status(400).json(errorResponse(error.message));
  }
}

export async function resetChatSession(req, res) {
  try {
    const { sessionId } = validateResetPayload(req.body);

    await chatService.resetSession(sessionId);

    return res.status(200).json(
      successResponse({
        sessionId,
        message: "Session reset successfully",
      })
    );
  } catch (error) {
    return res.status(400).json(errorResponse(error.message));
  }
}