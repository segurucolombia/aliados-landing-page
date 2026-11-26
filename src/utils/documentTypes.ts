export interface DocumentType {
  tipo: string;
  nombre: string;
}

export const DOCUMENT_TYPES: DocumentType[] = [
  { tipo: 'CC', nombre: 'Cédula de Ciudadanía' },
  { tipo: 'CE', nombre: 'Cédula de Extranjería' },
  { tipo: 'NIT', nombre: 'Número de Identificación Tributaria' },
  { tipo: 'PP', nombre: 'Pasaporte' },
  { tipo: 'TI', nombre: 'Tarjeta de Identidad' },
  { tipo: 'DNI', nombre: 'Documento Nacional de Identidad' },
  { tipo: 'RG', nombre: 'Carteira de Identidade / Registro Geral' },
];

/**
 * Documentos aceptados para registrarse en el Club SEGURU (persona natural y
 * representante de empresa): solo mayores de edad que pueden contratar en
 * Colombia. El NIT no va aquí: la empresa lo escribe en su propia sección.
 * Debe coincidir con CLUB_DOCUMENT_TYPES del backend.
 */
export const CLUB_DOCUMENT_TYPES: DocumentType[] = [
  { tipo: 'CC', nombre: 'Cédula de Ciudadanía' },
  { tipo: 'CE', nombre: 'Cédula de Extranjería' },
  { tipo: 'OTRO', nombre: 'Otro documento' },
];
