/** @type {import('tailwindcss').Config} */
import tailwindAnimate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        tekoRegular: ['TekoRegular', 'sans-serif'],
        tekoMedium: ['TekoMedium', 'sans-serif'],
        oswaldLight: ['OswaldLight', 'sans-serif'],
        oswaldRegular: ['OswaldRegular', 'sans-serif'],
        oswaldMedium: ['OswaldMedium', 'sans-serif'],
        oswaldBold: ['OswaldBold', 'sans-serif'],
        oswaldHeavyItalic: ['OswaldHeavyItalic', 'sans-serif'],
        poppinsLight: ['PoppinsLight', 'sans-serif'],
        poppinsRegular: ['PoppinsRegular', 'sans-serif'],
        poppinsMedium: ['PoppinsMedium', 'sans-serif'],
        poppinsBold: ['PoppinsBold', 'sans-serif'],
      },
      screens: {
        xs: '320px',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shake: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
      },
      dropShadow: {
        gold: ['0 0 5px #FFD700', '0 0 10px #FFD700', '0 0 20px #FFD70055'],
      },
    },
  },
  plugins: [tailwindAnimate],
}
