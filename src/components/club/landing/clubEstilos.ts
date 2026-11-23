/**
 * Clases de Tailwind compartidas, con el sistema de diseño SEGURU (ver tailwind.config.mjs):
 * botones con radio de 14px, naranja de acento (texto oscuro encima) para la acción principal,
 * índigo de marca para lo demás, tarjetas planas con borde fino y radio de 16px.
 */

const foco = 'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-orange-500';

const boton =
  'inline-flex items-center justify-center gap-2 text-center min-h-[50px] px-[22px] py-3 rounded-btn font-bold text-[17px] leading-tight border-2 border-transparent transition-[filter,background-color,color,border-color] duration-150 ' +
  foco;

export const BTN = {
  /** Acción principal: naranja de acento con texto oscuro */
  principal: `${boton} bg-accent text-accent-ink hover:brightness-105`,
  /** Índigo de marca */
  azul: `${boton} bg-brand text-white hover:bg-primary-700`,
  /** Secundario: transparente con borde fino */
  borde: `${boton} bg-transparent text-brand border-line hover:border-primary-300 hover:bg-white`,
  /** Secundario sobre fondos oscuros (brand-deep) */
  bordeClaro: `${boton} bg-transparent text-white border-white/40 hover:border-white hover:bg-white/10`,
  /** WhatsApp */
  whatsapp: `${boton} bg-green-600 text-white hover:bg-green-700`,
};

export const FOCO = foco;

/** Contenedor de cada sección */
export const CONTENEDOR = 'container mx-auto px-4 md:px-10';

/** Tarjeta plana: superficie blanca, borde fino, radio 16px */
export const TARJETA = 'bg-white rounded-card border border-line';

/** Antetítulo en mayúsculas sobre los títulos de sección */
export const KICK = 'text-[12.5px] font-bold tracking-[.1em] uppercase text-brand';

/** Pastilla redonda (etiquetas) */
export const PILL = 'inline-flex items-center gap-1 rounded-full px-[11px] py-1 text-[13px] font-bold bg-accent-soft text-accent-ink';
export const PILL_OK = 'inline-flex items-center gap-1 rounded-full px-[11px] py-1 text-[13px] font-bold bg-green-50 text-green-600';
