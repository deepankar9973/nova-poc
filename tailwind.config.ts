import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/frontend/**/*.{js,ts,jsx,tsx,mdx}', // This line is crucial
  ],
  theme: {
    extend: {
      colors: {
        'moneyview-blue': '#2b73de',
        'moneyview-green': '#37c893',
      },
    },
  },
  plugins: [],
}
export default config