/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        cream: "var(--cream)",
        maroon: "var(--maroon)",
        burgundy: "var(--burgundy)",
        burgundyDark: "var(--burgundy-dark)",
        gold: "var(--gold)",
        goldLight: "var(--gold-light)",
        muted: "var(--muted)",
        line: "var(--line)",
        success: "var(--success)",
        wa: "var(--wa)"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      borderRadius: { xl2: "16px" }
    }
  },
  plugins: []
};
