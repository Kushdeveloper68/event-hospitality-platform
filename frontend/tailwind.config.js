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
        primary: "var(--color-primary)",
        "primary-strong": "var(--color-primary-strong)",
        "primary-soft": "var(--color-primary-soft)",
        "background-light": "var(--color-background-light)",
        "background-dark": "var(--color-background-dark)",
        "neutral-text": "var(--color-text)",
        "neutral-muted": "var(--color-text-muted)",
        "neutral-surface": "var(--color-surface)",
        "neutral-border": "var(--color-border)",
        "neutral-soft": "var(--color-surface-muted)",
        "neutral-light": "var(--color-surface-muted)",
        "border-subtle": "var(--color-border)",
        "border-light": "var(--color-border-strong)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        "error-red": "var(--color-danger)",
        danger: "var(--color-danger)",
        surface: {
          DEFAULT: "var(--color-surface)",
          muted: "var(--color-surface-muted)",
          elevated: "var(--color-surface-elevated)",
        },
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
      },

      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },

      borderRadius: {
        DEFAULT: "var(--radius-sm)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "9999px"
      },

      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        soft: "var(--shadow-soft)"
      }
    }
  },

  plugins: []
};
