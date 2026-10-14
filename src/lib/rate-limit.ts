const ipCache = new Map<string, number[]>();

/**
 * Validates request count to prevent spam abuse.
 * Allows a default of 5 submissions per minute per IP.
 */
export function checkRateLimit(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = ipCache.get(ip) || [];

  // Filter timestamps within the current sliding window
  const activeTimestamps = timestamps.filter((time) => now - time < windowMs);

  if (activeTimestamps.length >= limit) {
    return true; // Limit exceeded
  }

  activeTimestamps.push(now);
  ipCache.set(ip, activeTimestamps);
  return false;
}
