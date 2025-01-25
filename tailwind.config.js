module.exports = {
    important: true, // Add this line
    content: [
      './src/app/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
      './src/**/*.{js,ts,jsx,tsx}', // Catch-all
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }