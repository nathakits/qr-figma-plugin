module.exports = {
  purge: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans': ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
    },
    extend: {}
  },
  variants: {
    extend: {},
    opacity: ['disabled', 'hover'],
  },
  plugins: [],
}
