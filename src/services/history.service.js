const MAX_HISTORY = 20; // Disarankan 20 pesan (10 putaran) untuk konteks yang lebih baik

const sessionStore = new Map();

function getSessionHistory(sessionId) {
  return sessionStore.get(sessionId) || [];
}

function addMessage(sessionId, role, text) {
  const currentHistory = getSessionHistory(sessionId);

  currentHistory.push({
    role,
    text,
  });

  // Batasi history supaya tidak kepanjangan
  const trimmedHistory = currentHistory.slice(-MAX_HISTORY);

  sessionStore.set(sessionId, trimmedHistory);
}

function clearSession(sessionId) {
  sessionStore.delete(sessionId);
}

export const historyService = {
  getSessionHistory,
  addMessage,
  clearSession,
};