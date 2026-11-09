// Google sends the user's profile photo as a URL (profile.photos[0].value).
// We only keep it if it is an https link on one of Google's own image hosts, so
// nothing else can ever end up in an <img src> on our pages.

const GOOGLE_IMAGE_HOSTS = /(^|\.)(googleusercontent\.com|ggpht\.com)$/;

const sanitizeProfilePicture = (url) => {
  if (typeof url !== "string" || url.length === 0 || url.length > 500) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    if (!GOOGLE_IMAGE_HOSTS.test(parsed.hostname.toLowerCase())) return null;
    return parsed.toString();
  } catch {
    return null;
  }
};

module.exports = { sanitizeProfilePicture };
