/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"theme-bg": "#fafafa",
				"theme-text": "#1b1b1b",
				"theme-blue": "#4476fb",
				"theme-input": "#F7F7F7",
				"theme-gray": "#5D6588",
				"theme-light-gray": "#A5A8B7",
			},
			screens: {
				xs: "475px",
				"2xs": "435px",
				"3xs": "340px",
				"3xl": "2000px",
			},
			fontFamily: {
				sans: ["Poppins", "sans-serif"],
			},
		},
	},
	plugins: [],
};
