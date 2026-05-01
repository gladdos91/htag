import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-public-sans)', 'sans-serif'],
      },
      colors: {
        sage: {
          900: '#2c4a3e',
          800: '#3d6354',
          700: '#4d7969',
          600: '#6b9382',
          500: '#8aae9d',
          200: '#cfddd5',
          100: '#e8f0ec',
        },
        cream: {
          50: '#fefaf2',
          100: '#fdf4e6',
          200: '#f9ead2',
        },
        coral: {
          600: '#e07a5f',
          500: '#ee9480',
          400: '#f4ac9a',
          200: '#fbd9cf',
          100: '#fde8e0',
        },
        gold: {
          500: '#e8b04d',
          400: '#f0c574',
          200: '#f7e2b6',
        },
        sky: {
          500: '#7fb3c9',
          200: '#cfe1ea',
        },
        ink: '#2d2a26',
      },
    },
  },
  plugins: [],
};

export default config;
