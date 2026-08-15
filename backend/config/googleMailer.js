const { google } = require("googleapis");

// ── Gmail API mailer client ────────────────────────────────────────────────
// Replaces the old SMTP/nodemailer transporter. Uses OAuth2 with a
// long-lived refresh token (minted once via scripts/getGmailRefreshToken.js)
// so the app can send mail as GOOGLE_SENDER_EMAIL without storing a password
// or app-password anywhere.
const REQUIRED_ENV = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_MAILER_REFRESH_TOKEN",
  "GOOGLE_SENDER_EMAIL",
];

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    throw new Error(
      `${key} missing in .env — required for the Gmail API mailer. ` +
        `Run scripts/getGmailRefreshToken.js once to generate GOOGLE_MAILER_REFRESH_TOKEN.`
    );
  }
}

// The redirect URI here only has to match what was used when the refresh
// token was generated (see scripts/getGmailRefreshToken.js). It is not
// hit again on every send — refresh tokens don't expire that way.
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_MAILER_REDIRECT_URI ||
    "http://localhost:7000/oauth2callback"
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

module.exports = { gmail, oAuth2Client };