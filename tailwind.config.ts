import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				'border-strong': 'hsl(var(--border-strong))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: {
					DEFAULT: 'hsl(var(--background))',
					secondary: 'hsl(var(--background-secondary))',
					tertiary: 'hsl(var(--background-tertiary))',
				},
				foreground: {
					DEFAULT: 'hsl(var(--foreground))',
					secondary: 'hsl(var(--foreground-secondary))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					glow: 'hsl(var(--primary-glow))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					glow: 'hsl(var(--secondary-glow))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					glow: 'hsl(var(--accent-glow))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					glow: 'hsl(var(--success-glow))',
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					glow: 'hsl(var(--warning-glow))',
				},
				error: {
					DEFAULT: 'hsl(var(--error))',
					glow: 'hsl(var(--error-glow))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius-lg)',
				DEFAULT: 'var(--radius)',
				md: 'var(--radius)',
				sm: 'var(--radius-sm)'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-card': 'var(--gradient-card)',
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'card': 'var(--shadow-card)',
				'primary': 'var(--shadow-primary)',
				'secondary': 'var(--shadow-secondary)',
			},
			backdropBlur: {
				'glass': 'var(--glass-backdrop)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(var(--primary) / 0.4)' },
					'50%': { boxShadow: '0 0 40px hsl(var(--primary) / 0.6)' }
				},
				'glow': {
					'from': { textShadow: '0 0 10px hsl(var(--primary) / 0.5)' },
					'to': { textShadow: '0 0 20px hsl(var(--primary) / 0.8)' }
				},
				'float': {
					'0%, 100%': { 
						transform: 'translateY(0px) rotate(0deg)',
						opacity: '0'
					},
					'10%, 90%': { opacity: '1' },
					'50%': { 
						transform: 'translateY(-100vh) rotate(180deg)'
					}
				},
				'data-stream': {
					'0%': { left: '-100%' },
					'100%': { left: '100%' }
				},
				'slide-up': {
					'from': { 
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'to': { 
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'matrix-rain': {
					'0%': { transform: 'translateY(-100vh)', opacity: '0' },
					'10%': { opacity: '1' },
					'90%': { opacity: '1' },
					'100%': { transform: 'translateY(100vh)', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'float': 'float 6s ease-in-out infinite',
				'slide-up': 'slide-up 0.6s ease-out',
				'data-stream': 'data-stream 3s linear infinite',
				'matrix-rain': 'matrix-rain 10s linear infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
