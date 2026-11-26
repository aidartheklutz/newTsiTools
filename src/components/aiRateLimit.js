const STORAGE_KEY = "tsitools-ai-request-history";
const REQUEST_LIMIT = 5;
const WINDOW_MS = 18 * 60 * 60 * 1000;

function readRecentRequests(now = Date.now()) {
  if (typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(stored)) return [];

    return stored
      .filter(
        (timestamp) =>
          Number.isFinite(timestamp) &&
          timestamp <= now &&
          timestamp > now - WINDOW_MS,
      )
      .sort((first, second) => first - second);
  } catch {
    return [];
  }
}

function saveRequests(timestamps) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(timestamps));
  } catch {
    // A disabled or full localStorage should not break the AI tools.
  }
}

function createStatus(timestamps, now) {
  const isLimited = timestamps.length >= REQUEST_LIMIT;

  return {
    isLimited,
    remainingRequests: Math.max(0, REQUEST_LIMIT - timestamps.length),
    msUntilNextRequest: isLimited
      ? Math.max(0, timestamps[0] + WINDOW_MS - now)
      : 0,
  };
}

export function getAiLimitStatus() {
  const now = Date.now();
  const timestamps = readRecentRequests(now);
  saveRequests(timestamps);
  return createStatus(timestamps, now);
}

export function recordSuccessfulAiRequest() {
  const now = Date.now();
  const timestamps = [...readRecentRequests(now), now];
  saveRequests(timestamps);
  return createStatus(timestamps, now);
}
