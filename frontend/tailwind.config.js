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
        primary: "#2463eb",
        "background-light": "#f6f6f8",
        "background-dark": "#111621",
            'neutral-text': '#111827',
            'border-subtle': '#E5E7EB',
            "neutral-surface": "#ffffff",
            "neutral-border": "#e5e7eb",
            "neutral-muted": "#6b7280",
            "success": "#10b981",
            "neutral-soft": "#f0f1f4",
            "neutral-light": "#f0f1f4",
            "border-light": "#dbdee6",
            "success": "#07883d",
            "warning": "#eab308",
            "danger": "#e73c08"
      },

      fontFamily: {
        display: ["Inter", "sans-serif"]
      },

      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      }
    }
  },

  plugins: []
};
