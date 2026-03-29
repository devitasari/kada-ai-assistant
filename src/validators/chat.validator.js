export function validateChatPayload(body) {
  const { sessionId, message } = body || {};

  if (!sessionId || typeof sessionId !== "string") {
    throw new Error("sessionId is required and must be a string");
  }

  if (!message || typeof message !== "string") {
    throw new Error("message is required and must be a string");
  }

  return {
    sessionId,
    message,
  };
}

export function validateResetPayload(body) {
  const { sessionId } = body || {};

  if (!sessionId || typeof sessionId !== "string") {
    throw new Error("sessionId is required and must be a string");
  }

  return { sessionId };
}