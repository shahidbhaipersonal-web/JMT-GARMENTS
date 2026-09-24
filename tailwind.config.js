/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        cream: "var(--cream)",
        maroon: "var(--maroon)",
        gold: "var(--gold)",
        muted: "var(--muted)"
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
