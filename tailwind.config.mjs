/**
 * Paleta SEGURU (basada en el diseño del Club SEGURU).
 *
 * Tokens base:
 *   brand       #3232B3  (primary-600)   índigo de marca
 *   brand-deep  #141450  (primary-900)   franjas / tarjetas oscuras
 *   accent      #FD8701  (orange-500)    acción principal, texto encima: #3A2000 (orange-900)
 *   ink         #16163A  (gray-900)      texto
 *   muted       #58587A  (gray-600)      texto secundario
 *   line        #DCDCF0  (gray-200)      bordes
 *   soft        #ECECFA  (gray-100)      fondos suaves
 *   bg          #F4F4FB  (gray-50)       fondo de página
 *   ok          #1E8E5A  (green-600)     bad #B3321F (red-600)
 *
 * `blue`, `indigo` y `sky` apuntan a la misma escala de marca para que los
 * componentes existentes hereden el nuevo tono sin reescribirlos.
 */
const brand = {
	50: '#EEEEFB',
	100: '#DEDEF7',
	200: '#C0C0F0',
	300: '#9A9AE5',
	400: '#6E6ED6',
	500: '#4A4AD2',
	600: '#3232B3',
	700: '#28289A',
	800: '#1E1E78',
	900: '#141450',
	950: '#0B0B24',
};

const neutral = {
	50: '#F4F4FB',
	100: '#ECECFA',
	200: '#DCDCF0',
	300: '#C4C4DE',
	400: '#8E8EAE',
	500: '#6B6B8E',
	600: '#58587A',
	700: '#3E3E62',
	800: '#26264A',
	900: '#16163A',
	950: '#0E0E28',
};

const accent = {
	50: '#FFF7EC',
	100: '#FFF0DC',
	200: '#FFDDB0',
	300: '#FFC27A',
	400: '#FEA640',
	500: '#FD8701',
	600: '#E07500',
	700: '#B85F00',
	800: '#8A4700',
	900: '#3A2000',
	950: '#241400',
};

const ok = {
	50: '#E3F5EB',
	100: '#CDEEDC',
	200: '#A3DFBF',
	300: '#6FCB9C',
	400: '#3FB27A',
	500: '#27A067',
	600: '#1E8E5A',
	700: '#18734A',
	800: '#135A3A',
	900: '#0E432B',
	950: '#08291A',
};

const bad = {
	50: '#FCEAE6',
	100: '#F9D6CF',
	200: '#F2B0A4',
	300: '#E88573',
	400: '#D85A45',
	500: '#C9432E',
	600: '#B3321F',
	700: '#932818',
	800: '#731F13',
	900: '#561710',
	950: '#360E09',
};

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: brand,
				secondary: neutral,
				blue: brand,
				indigo: brand,
				sky: brand,
				gray: neutral,
				slate: neutral,
				orange: accent,
				green: ok,
				emerald: ok,
				red: bad,
				brand: {
					DEFAULT: '#3232B3',
					deep: '#141450',
				},
				accent: {
					DEFAULT: '#FD8701',
					ink: '#3A2000',
					soft: '#FFF0DC',
				},
				ink: '#16163A',
				muted: '#58587A',
				line: '#DCDCF0',
				soft: '#ECECFA',
				page: '#F4F4FB',
			},
			fontFamily: {
				sans: ['Figtree', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
				display: ['"Bricolage Grotesque"', '"Trebuchet MS"', 'system-ui', 'sans-serif'],
			},
			borderRadius: {
				btn: '14px',
				card: '16px',
				band: '18px',
			},
		},
	},
	plugins: [],
};
