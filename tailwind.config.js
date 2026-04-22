export default {
  darkMode: "class", // enables dark mode toggle
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#dc2626", // 🔥 rich professional red (recommended)
      },
      boxShadow: {
        redGlow: "0 0 20px rgba(220, 38, 38, 0.4)", // soft red glow
      },
    },
  },
  plugins: [],
};