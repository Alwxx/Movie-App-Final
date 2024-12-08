/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        bounce2: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.5)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        bounce2: "bounce2 0.25s ease-out",
      },
    },
  },
  plugins: [import("@tailwindcss/forms")],
};
