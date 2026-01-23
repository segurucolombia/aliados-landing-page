/**
 * Tipos de datos para preguntas frecuentes
 */

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  active?: boolean;
}

export interface FAQCategory {
  id: string;
  name: string;
  description?: string;
  faqs: FAQ[];
}
