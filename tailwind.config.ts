import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    // ... your content paths
    './src/frontend/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // --- ADD MONEYVIEW BRAND PALETTE ---
      colors: {
        'mv-green-dark': '#1E5945',
        'mv-green-light': '#E8F5E9',
        'mv-text-heading': '#212121',
        'mv-text-body': '#424242',
        'mv-text-label': '#757575',
        'mv-border': '#E0E0E0',
        'mv-bg': '#F7F7F7',
      },
      // --- ADD MONEYVIEW FONT FAMILY ---
      fontFamily: {
        sans: ['AtAero', 'sans-serif'], // Sets "AtAero" as the default font
      },
      borderRadius: {
        'xl': '12px', // Match the button/input radius
      }
    },
  },
  plugins: [],
}
export default config