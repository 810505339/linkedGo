/** @type {import('tailwindcss').Config} */
module.exports = {

  theme: {

    extend: {
      spacing: {
        // 2.5: '0.625rem', // 10px
        // 3.5: '0.875rem', // 14px
        // 4.5: '1.125rem', // 18px
        // 5.5: '1.375rem', // 22px
        // 6.5: '1.625rem', // 26px
        // 7: '1.75rem', // 28px
        // 9: '2.25rem', // 36px
        // 9.5: '2.375rem', // 38px
        // 15.75: '3.9375rem', // 63px
        // 16.5: '4.125rem', // 66px
        // 17: "4.25rem", // 68px
        // 22.5: '5.625rem', // 90px
        // 23: "5.75rem", // 92px
        // 25: '6.25rem', // 100px
        // 25.5: '6.375rem', // 102px
        // 25.75: '6.4375rem', // 103px
        // 27: '6.75rem', // 108px
        // 27.5: '6.875rem', // 110px
        // 30.25: '7.5625rem', // 121px
        // 35.5: '8.875rem' // 142px
      },
      fontSize: {
        // 10: '0.625rem', // 10px
        // 13: '0.8125rem', // 13px
        // 15: '0.9375rem', // 15px
        // 22: '1.375rem', // 22px
        // 26: '1.625rem', // 26px
        // 28: '1.75rem', // 28px
        // 32: '2rem', // 32px
        // 40: '2.5rem', // 40px
        // 42: '2.625rem', // 42px
        // 45: '2.8125rem', // 45px
        // 54: '3.375rem', // 54px
      },
      fontFamily: {
        // add your font family
      },
      borderRadius: {
        // add your custom border radius
      },
      screens: {
        // add your custom screen width
      },
      opacity: {
        10: '0.1',
        60: '0.6',
        80: '0.8',
      },
    },
  },
  variants: {},
  plugins: [],
  presets: [require("nativewind/preset")],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],

};
