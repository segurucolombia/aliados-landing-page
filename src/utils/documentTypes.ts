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
