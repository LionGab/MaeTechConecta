// tailwind.config.js
const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.lingue = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
       colors: {
        background: 'hsl(340 50% 98%)',
        foreground: 'hsl(240 10% 3.9%)',
        card: 'hsl(340 50% 100%)',
        'card-foreground': 'hsl(240 10% 3.9%)',
        popover: 'hsl(0 0% 100%)',
        'popover-foreground': 'hsl(240 10% 3.9%)',
        primary: 'hsl(348 76% 76%)',
        'primary-foreground': 'hsl(355 100% 99%)',
        secondary: 'hsl(348 20% 96%)',
        'secondary-foreground': 'hsl(240 5.9% 10%)',
        muted: 'hsl(348 20% 96%)',
        'muted-foreground': 'hsl(240 3.8% 46.1%)',
        accent: 'hsl(348 76% 90%)',
        'accent-foreground': 'hsl(240 5.9% 10%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        'destructive-foreground': 'hsl(0 0% 98%)',
        border: 'hsl(348 20% 90%)',
        input: 'hsl(348 20% 90%)',
        ring: 'hsl(348 76% 76%)',
      },
      fontFamily: {
        body: ["Inter_400Regular"],
        headline: ["Poppins_700Bold"],
      },
      borderRadius: {
        lg: "1rem",
        md: "calc(1rem - 4px)",
        sm: "calc(1rem - 8px)",