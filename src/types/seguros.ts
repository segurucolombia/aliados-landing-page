/**
 * Tipos de datos para el sistema de seguros
 * Estos serán actualizados según la estructura de los endpoints
 */

export interface Seguro {
  id: string;
  tipo: string;
  nombre: string;
  descripcion: string;
  icono?: string;
  activo: boolean;
}

export interface SeguroDetalle extends Seguro {
  coberturas: Cobertura[];
  requisitos: string[];
  beneficios: string[];
  precioBase?: number;
}

export interface Cobertura {
  id: string;
  nombre: string;
  descripcion: string;
  montoMaximo?: number;
  incluida: boolean;
}

export interface CotizacionRequest {
  tipoSeguro: string;
  datosPersonales: DatosPersonales;
  datosAdicionales?: Record<string, any>;
}

export interface DatosPersonales {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento?: string;
  identificacion?: string;
}

export interface CotizacionResponse {
  id: string;
  tipoSeguro: string;
  prima: number;
  coberturas: Cobertura[];
  vigencia: string;
  detalles: Record<string, any>;
  createdAt: string;
}

export interface Poliza {
  id: string;
  numero: string;
  tipoSeguro: string;
  cliente: DatosPersonales;
  prima: number;
  coberturas: Cobertura[];
  fechaInicio: string;
  fechaFin: string;
  estado: 'activa' | 'vencida' | 'cancelada';
}
