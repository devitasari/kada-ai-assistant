import { redisClient } from "../config/redis.js";

const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24 jam
const MAX_HISTORY = 6; // Menyimpan 5 putaran percakapan terakhir

function getSessionKey(sessionId) {
  return `chat:session:${sessionId}`;
}

async function getSessionHistory(sessionId) {
  const raw = await redisClient.get(getSessionKey(sessionId));
  return raw ? JSON.parse(raw) : [];
}

async function addMessage(sessionId, role, text) {
  const history = await getSessionHistory(sessionId);

  history.push({
    role,
    text,
  });

  // Batasi history supaya tidak kepanjangan
  const trimmedHistory = history.slice(-MAX_HISTORY);

  await redisClient.set(
    getSessionKey(sessionId),
    JSON.stringify(trimmedHistory),
    {
      EX: SESSION_TTL_SECONDS,
    }
  );
}

async function clearSession(sessionId) {
  await redisClient.del(getSessionKey(sessionId));
}

export const historyService = {
  getSessionHistory,
  addMessage,
  clearSession,
};