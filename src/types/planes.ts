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

export interface PlanWithDetails extends PlanBase {
  producto: Producto;
  version: VersionWithDetails | null;
}

/**
 * Tipos para creación de versiones y planes
 */

export interface CoberturaInput {
  id: string;
  valor?: string;
  descripcion?: string;
}

export interface CreateVersionDto {
  nombre: string;
  descripcion?: string;
  valor_asegurado: number;
  vigencia_inicio: string;
  precio: number;
  coberturas: CoberturaInput[];
  documento?: any; // Express.Multer.File en backend
  documento_id?: string;
  created_by: string;
  mostrar_publico?: boolean;
}

// DTO para el frontend (sin el tipo File de Express)
export interface CreateVersionFrontendDto {
  nombre: string;
  descripcion?: string;
  valor_asegurado: number;
  vigencia_inicio: 'Inmediatamente' | 'Dia siguiente' | 'Primer dia del mes siguiente';
  precio: number;
  coberturas: CoberturaInput[];
  documento?: File; // File del navegador (cuando se sube un archivo nuevo)
  documento_id?: string; // UUID de documento existente
  created_by: string;
}

export interface CreatePlanDto {
  producto_id: string;
  estado?: boolean;
  mostrar_publico?: boolean;
  created_by: string;
  version: CreateVersionDto;
}

export interface FindPlanesByProductoParams {
  producto_id: string;
  limit: number;
  offset: number;
  estado?: boolean;
}

/**
 * Tipos para campos adicionales dinámicos
 */

export type TipoInput = 'text' | 'number' | 'email' | 'date' | 'fecha' | 'tel' | 'precio' | 'plano' | 'ciudad' | 'textarea';

export interface CampoInput {
  tipo: 'input';
  nombre: string;
  tipoInput: TipoInput;
  requerido?: boolean;
}

export interface CampoDropdown {
  tipo: 'dropdown';
  nombre: string;
  opciones: string[];
  requerido?: boolean;
}

export interface CampoMultiselect {
  tipo: 'multiselect';
  nombre: string;
  opciones: string[];
  requerido?: boolean;
}

export interface CampoGrupoInputs {
  tipo: 'grupo_inputs';
  nombre: string;
  campos: (CampoInput | CampoDropdown)[];
  requerido?: boolean;
  cantidad_maxima_registros?: number | null;
}

export interface CampoAutocomplete {
  tipo: 'autocomplete';
  nombre: string;
  fuente: 'ciudades';
  requerido?: boolean;
}

export type CampoAdicional = CampoInput | CampoDropdown | CampoMultiselect | CampoGrupoInputs | CampoAutocomplete;

export interface SeccionCamposAdicionales {
  titulo: string;
  descripcion?: string;
  campos: CampoAdicional[];
}

export interface CamposAdicionalesConfig {
  secciones: SeccionCamposAdicionales[];
}

export interface VersionWithCamposAdicionales extends Version {
  campos_adicionales?: CamposAdicionalesConfig;
}

export interface VersionWithDetailsAndCamposAdicionales extends VersionWithDetails {
  campos_adicionales?: CamposAdicionalesConfig;
}

export interface PlanConCoberturasYCampos extends PlanBase {
  producto: Producto;
  version: VersionWithDetailsAndCamposAdicionales | null;
}

/**
 * Tipos para datos capturados de campos adicionales
 */

export interface DatosSeccionCapturados {
  titulo: string;
  datos: Record<string, any>;
}

export interface CamposAdicionalesCapturados {
  secciones: DatosSeccionCapturados[];
}
