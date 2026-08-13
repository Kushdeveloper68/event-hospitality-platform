/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./index.html"
  ],

  theme: {
    extend: {
      colors: {
        // ── Brand primary (blue) — full ramp so every page pulls from the
        // same scale instead of raw blue-500/blue-700 scattered around ──
        primary: {
          50: "#eef4ff",
          100: "#dce8ff",
          200: "#b8d1ff",
          300: "#85aeff",
          400: "#5285fb",
          500: "#2463eb", // brand base — unchanged, everything already keys off this
          600: "#1a4fc4",
          700: "#163f9c",
          800: "#15347d",
          900: "#152d67",
          DEFAULT: "#2463eb",
        },

        // ── Surfaces — one name per role, resolved differently in light/dark
        // via the `dark:` variant, so pages stop mixing gray-* and slate-* ──
        surface: {
          DEFAULT: "#ffffff",   // cards, panels (light)
          soft: "#f6f6f8",      // page background (light)
          dark: "#161c2b",      // cards, panels (dark) — slate-900-ish, warmer than pure black
          "dark-soft": "#0d1220", // page background (dark)
        },
        "background-light": "#f6f6f8",
        "background-dark": "#0d1220",

        // ── Text ──
        "neutral-text": "#0f172a",
        "neutral-muted": "#64748b",
        "neutral-soft": "#f1f5f9",
        "neutral-light": "#f1f5f9",
        "neutral-surface": "#ffffff",
        "neutral-border": "#e2e8f0",
        "border-subtle": "#e2e8f0",
        "border-light": "#dbdee6",

        // ── Semantic status — kept distinct from brand primary on purpose ──
        success: "#0f9d58",
        warning: "#d97706",
        danger: "#dc2626",
        "error-red": "#dc2626",
      },

      fontFamily: {
        // Matches the landing page's pairing: Manrope for headings/brand,
        // DM Sans for body copy — same identity, applied app-wide.
        display: ["Manrope", "Inter", "sans-serif"],
        sans: ["DM Sans", "Inter", "sans-serif"],
      },

      // ── One type scale used everywhere: page-h1, section-h2, card-h3,
      // body, caption. Use these instead of ad-hoc text-[Npx]. ──
      fontSize: {
        "page-h1": ["28px", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "800" }],
        "section-h2": ["20px", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "700" }],
        "card-h3": ["15px", { lineHeight: "1.35", fontWeight: "600" }],
        body: ["14px", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "500" }],
        micro: ["10px", { lineHeight: "1.3", fontWeight: "600" }],
      },

      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.375rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px"
      },

      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 4px 12px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.06)",
        "card-dark": "0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.25)",
      },
    }
  },

  plugins: []
};