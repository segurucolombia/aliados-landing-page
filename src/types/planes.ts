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

/**
 * Tipos para el endpoint de planes por producto
 */

export interface GetPlanesByProductoInput {
  producto_id: string;
  limit: number;
  offset: number;
  estado?: boolean;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  estado: boolean;
  imagen_id: string | null;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
}

export interface DocumentoAws {
  id: string;
  nombre: string;
  ruta: string;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
}

export interface CoberturaDetalle {
  id: string;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
}

export interface CoberturaVersion {
  cobertura_id: string;
  version_id: string;
  valor: string;
  descripcion: string | null;
  created_at: Date;
  created_by: string;
  cobertura: CoberturaDetalle;
}

export interface Version {
  id: string;
  nombre: string;
  descripcion?: string;
  plan_id: string;
  documento_id: string | null;
  valor_asegurado: number;
  vigencia_inicio: string;
  precio: number;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
}

export interface VersionWithDetails extends Version {
  documento: DocumentoAws | null;
  coberturas: CoberturaVersion[];
}

export interface PlanBase {
  id: string;
  producto_id: string;
  version_id: string | null;
  estado: boolean;
  mostrar_publico: boolean;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
}

export interface PlanConCoberturas extends PlanBase {
  producto: Producto;
  version: VersionWithDetails | null;
}

export interface PaginatedPlanes {
  data: PlanConCoberturas[];
  total: number;
}
