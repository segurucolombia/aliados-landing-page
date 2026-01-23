import type { TLocationsColombiaAttributes } from "../services/ubicaciones";

export type TFiltersCotizarPlan = {
    capacidad_maxima:number;
}
export type TPlanCotizar = {
  capacidad_maxima:number;
  capacidad_id:string;
  planes: {
      id:string;
      nombre:string;
      precio:number;
      version_id:string;
      documento_id?:string;
      coberturas: {id:string;nombre:string;precio:string, descripcion:string}[];
  }[];
}

export type THoteles = {
  capacidad_maxima:number;
  numero_habitaciones:number;
  nombre:string;
  id:number;
}

export type THotelesDetalle = THoteles & {
  expanded:boolean;
  tipo_alojamiento:string;
  amenidades:string[];
  direccion:string;
  ciudad:string | TLocationsColombiaAttributes;
}

/**
 * Nuevos tipos de datos para planes y coberturas de productos
 */

export interface Cobertura {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  orden?: number;
}

export interface CoberturaPlan {
  coberturaId: string;
  aplica: boolean;
  valorCubierto?: number;
  descripcion?: string;
  detalles?: string;
  limitaciones?: string;
}

export interface Plan {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  moneda: string;
  periodicidad: 'mensual' | 'trimestral' | 'semestral' | 'anual';
  destacado?: boolean;
  coberturas: CoberturaPlan[];
  caracteristicas?: string[];
  color?: string;
}

export interface ProductoPlanes {
  productoId: string;
  productoNombre: string;
  productoDescripcion?: string;
  coberturas: Cobertura[];
  planes: Plan[];
}
