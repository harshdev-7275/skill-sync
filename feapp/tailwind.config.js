/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    './app/**/*.{js,jsx,ts,tsx}', // Includes all files in the `app` folder
    'node_modules/nativewind/**/*.js', // Includes NativeWind components
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        "poppins-bold": ['Poppins-Bold', 'sans-serif'],
        "poppins-black": ['Poppins-Black', 'sans-serif'],
        "poppins-extrabold": ['Poppins-ExtraBold', 'sans-serif'],
        "poppins-extralight": ['Poppins-ExtraLight', 'sans-serif'],
        "poppins-light": ['Poppins-Light', 'sans-serif'],
        "poppins-medium": ['Poppins-Medium', 'sans-serif'],
        "poppins-regular": ['Poppins-Regular', 'sans-serif'],
        "poppins-semibold": ['Poppins-SemiBold', 'sans-serif'],
        "poppins-thin": ['Poppins-Thin', 'sans-serif'],
      },
      colors: {
        custom: {
          purple: "#4a0069", // Deep purple
          magenta: "#ef54c5", // Bright magenta
          lavender: "#f0c0ff", // Soft lavender-pink
          orange: "#f49b1b", // Warm orange-gold
          darkPurple: "#2b0630", // Very dark purple
        },
      },
    },
  },
  plugins: [],
};
