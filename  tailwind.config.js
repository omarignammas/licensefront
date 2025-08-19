
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@spartan-ng/brain/hlm-tailwind-preset')],
  content: [
    './src/**/*.{html,ts}',
    
  ],
  theme: {
    extend: {},
    fontFamily: {
      'sans': ['ui-sans-serif', 'system-ui'],
      'Euclid': ['Euclid Circular A', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      'Kodchasan': ['Kodchasan', 'sans-serif'],
      'Inter': ['Inter', 'sans-serif'],
      'Questria': ['Questria', 'sans-serif'],
      'playfair-display-Ds': ['Playfair Display', 'sans-serif'],
      'Poppins': ['Poppins', 'sans-serif'],
      
    },
  },
  plugins: [],
};
