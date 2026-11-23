import { nextTick } from 'vue';

/** Quita puntos, espacios y guiones: el documento es el usuario de inicio de sesión */
export const limpiarDocumento = (valor: string): string => valor.replace(/[\s.\-]/g, '');

export const validarDocumento = (valor: string): string => {
  if (!valor) return 'Escribe tu número de documento.';
  if (!/^[A-Za-z0-9]{3,20}$/.test(valor)) return 'Usa solo letras y números, sin puntos (de 3 a 20 caracteres).';
  return '';
};

export const validarEmail = (valor: string): string => {
  if (!valor.trim()) return 'Escribe tu correo.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim())) return 'Revisa el correo: parece incompleto.';
  return '';
};

export const validarClave = (valor: string): string => {
  if (!valor) return 'Escribe una contraseña.';
  if (valor.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  if (valor.length > 72) return 'La contraseña puede tener máximo 72 caracteres.';
  return '';
};

/** Lleva el foco al primer campo marcado con error dentro del contenedor */
export const enfocarPrimerError = async (contenedor: HTMLElement | null | undefined): Promise<void> => {
  await nextTick();
  const campo = contenedor?.querySelector<HTMLElement>('[aria-invalid="true"]');
  campo?.focus();
};
