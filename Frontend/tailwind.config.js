/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        primaryText: "#191919",
        secondaryText: "#737373",
        lightBg: "#F7F7F7",
        subtleBorder: "#EAEAEA",
        brandBlue: {
          DEFAULT: "#2383E2",
          hover: "#1B6EC2",
          light: "#EBF3FC",
        },
        // Subtle status colors for detection verdicts
        status: {
          scamBg: "#FEF2F2",
          scamText: "#991B1B",
          scamBorder: "#FEE2E2",
          suspiciousBg: "#FFFBEB",
          suspiciousText: "#92400E",
          suspiciousBorder: "#FEF3C7",
          safeBg: "#F0FDF4",
          safeText: "#166534",
          safeBorder: "#DCFCE7",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
      }
    },
  },
  plugins: [],
}

