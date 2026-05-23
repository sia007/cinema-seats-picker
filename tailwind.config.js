/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        projector: { "0%,100%": { opacity: ".16" }, "50%": { opacity: ".32" } },
        scan: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        projector: "projector 2.2s ease-in-out infinite",
        scan: "scan 4s linear infinite",
      },
      boxShadow: {
        glow: "0 0 35px rgba(220,38,38,.35)",
        gold: "0 0 28px rgba(245,158,11,.28)",
      },
    },
  },
  plugins: [],
};
