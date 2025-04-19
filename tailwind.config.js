/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        antiflashWhite: '#F5F6FA',
        lightGray: '#DEDEDE',
        darkGray: '#898989',
        lightGreen: '#BCDEDC',
        darkGreen: '#006D77',
        lightOrange: '#FFE6DE',
        darkOrange: '#E29578',
      },
      width: {
        rowLabels: '6rem',
        yFilterAxisSelector: '6rem',
      },
      height: {
        columnLabels: '4rem',
      },
      margin: {
        columnLabels: '4rem',
        yFilterAxisSelectorAndRowLabels: '12rem',
      },
      fontSize: {
        xxs: '0.625rem', // 10px
      },
    },
  },
  plugins: [],
};
