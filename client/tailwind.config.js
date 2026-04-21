/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: "#800000",
          50: "#fff5f5",
          100: "#f7dddd",
          200: "#ecb9b9",
          300: "#df8d8d",
          400: "#ce5b5b",
          500: "#b83434",
          600: "#9b1a1a",
          700: "#800000",
          800: "#5f0000",
          900: "#3c0000"
        },
        ivory: "#f7f1ea",
        ink: "#151515"
      },
      fontFamily: {
        heading: ['"Cinzel"', 'serif'],
        sans: ['"Manrope"', 'sans-serif']
      },
      boxShadow: {
        card: "0 24px 60px rgba(77, 10, 10, 0.12)"
      },
      backgroundImage: {
        'hero-pattern': 'radial-gradient(circle at top left, rgba(128,0,0,0.18), transparent 30%), linear-gradient(135deg, rgba(255,255,255,0.96), rgba(247,241,234,0.92))'
      }
    }
  },
  plugins: []
};
