import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/frontend/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mv-green-dark': '#144835',
        'mv-green': '#16a34a',
        'mv-green-light': '#E8F5E9',
        'mv-text-heading': '#1f2937',
        'mv-text-body': '#4b5563',
        'mv-text-label': '#6b7280',
        'mv-border': '#e5e7eb',
        'mv-bg': '#f9fafb',
      },
      fontFamily: {
        sans: ['AtAero', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config