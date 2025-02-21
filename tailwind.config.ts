import daisyui from "daisyui";
import animate from "tailwindcss-animate";
import containerQueries from "@tailwindcss/container-queries";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    animate,
    containerQueries,
    daisyui,
  ],
} satisfies Config;