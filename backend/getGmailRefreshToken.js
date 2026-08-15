/**
 * ONE-TIME SETUP SCRIPT — run this locally, once, to mint a refresh token
 * for the Gmail API mailer.
 *
 * Usage:
 *   1. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to backend/.env
 *      (same values as your existing Google OAuth login credentials, or a
 *      new OAuth client — either works, see chat notes on scopes/redirect URI).
 *   2. In Google Cloud Console, add this EXACT redirect URI to the OAuth
 *      client's "Authorized redirect URIs":
 *        http://localhost:5000/oauth2callback
 *   3. Run:  node scripts/getGmailRefreshToken.js
 *   4. It opens (prints) a Google consent URL — open it in a browser,
 *      sign in with the Gmail account you want to send FROM
 *      (e.g. noreply@yourdomain or your Gmail address), approve the
 *      "Send email on your behalf" permission.
 *   5. Google redirects to localhost:7000/oauth2callback — this script
 *      catches that, exchanges the code for tokens, and prints the
 *      refresh_token to your terminal.
 *   6. Copy that refresh_token into backend/.env as GOOGLE_MAILER_REFRESH_TOKEN.
 *   7. Set GOOGLE_SENDER_EMAIL in .env to the same account you signed in
 *      with in step 4 — that's who the mail will be sent "from".
 *   8. Delete/ignore this script's local server, it's not needed at runtime.
 */

require("dotenv").config({ path: __dirname + "/.env" });
const http = require("http");
const { google } = require("googleapis");

const REDIRECT_URI = "http://localhost:5000/oauth2callback";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in .env");
  process.exit(1);
}

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline", // required to get a refresh_token back
  prompt: "consent", // forces Google to re-issue a refresh_token even if you've authorized before
  scope: ["https://www.googleapis.com/auth/gmail.send"],
});

console.log("\n1. Open this URL in your browser and approve access:\n");
console.log(authUrl);
console.log("\n2. Waiting for redirect on http://localhost:5000/oauth2callback ...\n");

const server = http
  .createServer(async (req, res) => {
    if (!req.url.startsWith("/oauth2callback")) {
      res.end("Not found");
      return;
    }

    const url = new URL(req.url, REDIRECT_URI);
    const code = url.searchParams.get("code");

    if (!code) {
      res.end("No code received — check the terminal and try again.");
      return;
    }

    try {
      const { tokens } = await oAuth2Client.getToken(code);
      res.end("Success! You can close this tab and check your terminal.");
      console.log("\n✅ Add this to your .env file:\n");
      console.log(`GOOGLE_MAILER_REFRESH_TOKEN=${tokens.refresh_token}\n`);
      if (!tokens.refresh_token) {
        console.log(
          "⚠️  No refresh_token was returned. This usually means this Google\n" +
            "account already granted consent before. Go to\n" +
            "https://myaccount.google.com/permissions, remove access for this\n" +
            "app, then re-run this script.\n"
        );
      }
    } catch (err) {
      console.error("Error exchanging code for tokens:", err.message);
      res.end("Error — check the terminal.");
    } finally {
      server.close();
      process.exit(0);
    }
  })
  .listen(5000);