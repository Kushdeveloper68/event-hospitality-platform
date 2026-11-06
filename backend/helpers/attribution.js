// "Where did this signup come from?" — the frontend remembers the first link a
// visitor arrived through (e.g. ?utm_source=instagram&utm_medium=bio) and sends
// it along when they sign up. Everything here comes from the browser, so it is
// treated as untrusted: only a few short, plain-text fields are kept.

const MAX_AGE_DAYS = 90;

// Lowercase, letters/digits and a few separators only (no markup, no spaces runs).
const cleanToken = (value, max = 60) => {
  if (typeof value !== "string") return null;
  const cleaned = value.toLowerCase().replace(/[^a-z0-9 _.\-+/]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
  return cleaned || null;
};

const cleanHost = (value) => {
  if (typeof value !== "string") return null;
  const cleaned = value.toLowerCase().replace(/[^a-z0-9.\-]/g, "").slice(0, 80);
  return cleaned || null;
};

const cleanPath = (value) => {
  if (typeof value !== "string" || !value.startsWith("/")) return null;
  const cleaned = value.split(/[?#]/)[0].replace(/[^a-zA-Z0-9/_\-.]/g, "").slice(0, 100);
  return cleaned || null;
};

/**
 * Returns a clean { source, medium, campaign, referrer, landingPath, capturedAt }
 * object, or null if there's no usable source.
 */
const sanitizeAttribution = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;

  const source = cleanToken(input.source);
  if (!source) return null;

  let capturedAt = new Date(input.capturedAt);
  const now = Date.now();
  if (Number.isNaN(capturedAt.getTime()) || capturedAt.getTime() > now + 86400000 || capturedAt.getTime() < now - MAX_AGE_DAYS * 86400000) {
    capturedAt = new Date(now);
  }

  return {
    source,
    medium: cleanToken(input.medium),
    campaign: cleanToken(input.campaign, 80),
    referrer: cleanHost(input.referrer),
    landingPath: cleanPath(input.landingPath),
    capturedAt,
  };
};

// For the Google flow the attribution travels through Google's redirect in the
// OAuth `state` parameter as base64url-encoded JSON.
const decodeAttributionParam = (param) => {
  if (typeof param !== "string" || !/^[A-Za-z0-9_-]{1,1500}$/.test(param)) return null;
  try {
    return sanitizeAttribution(JSON.parse(Buffer.from(param, "base64url").toString("utf8")));
  } catch {
    return null;
  }
};

module.exports = { sanitizeAttribution, decodeAttributionParam };
