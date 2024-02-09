import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-aeonik-sans)'],
        mono: ['var(--font-aeonik-mono)'],
      },
      colors: {
        'primary': {
          '50': '#f6f5fd',
          '100': '#efedfa',
          '200': '#e1ddf7',
          '300': '#cbc2f0',
          '400': '#b09fe6',
          '500': '#9478da',
          '600': '#8761ce',
          '700': '#7249b8',
          '800': '#5f3c9b',
          '900': '#4f337f',
          '950': '#322055',
        }
      }
    },
  },
  plugins: [],
};
export default config;
