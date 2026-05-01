/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // Zmienione z 'tailwindcss' na '@tailwindcss/postcss'
    autoprefixer: {},
  },
};

export default config;