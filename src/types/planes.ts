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
  vigencia_numero_meses: number;
  destacado?: boolean;
  coberturas: CoberturaPlan[];
  caracteristicas?: string[];
  color?: string;
  valor_debito_automatico?: number | null;
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

export interface EstilosAseguradora {
  id: string;
  aseguradora_id: string;
  color_primario: string;
  color_secundario: string;
  logo?: string | null;
  logo_imagen?: { id: string; url?: string; nombre?: string } | null;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
}

export interface Aseguradora {
  id: string;
  nombre: string;
  correo?: string;
  telefono?: string;
  estado: boolean;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
  estilos?: EstilosAseguradora;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  estado: boolean;
  imagen_id: string | null;
  categoria_id?: string;
  aseguradora_id?: string;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
  aseguradora?: Aseguradora;
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
  vigencia_numero_meses: number;
  precio: number;
  valor_debito_automatico?: number | null;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
}

export interface VersionWithDetails extends Version {
  documento: DocumentoAws | null;
  coberturas: CoberturaVersion[];
  /** Configuración del formulario de campos adicionales de la versión */
  campos_adicionales?: CamposAdicionalesConfig | null;
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

/**
 * Opción de un campo de selección (dropdown / multiselect).
 * Se muestra `etiqueta` al cliente y se envía `clave` al backend.
 */
export interface OpcionCampo {
  clave: string;
  etiqueta: string;
}

/** Qué hace la regla cuando se cumple su condición */
export type AccionRegla = 'COBRAR' | 'RECHAZAR';

/** Cómo se interpreta `valor_adicional`: monto fijo o % sobre el precio del plan */
export type TipoValorRegla = 'FIJO' | 'PORCENTAJE';

/**
 * Condición configurada sobre un campo que encarece la compra o la impide.
 * Solo sirve para anticiparle el cargo al cliente: el total siempre lo calcula
 * el backend en `POST /ventas/cotizar`.
 */
export interface ReglaCampo {
  tipo_regla: 'OPCION' | 'RANGO_MAXIMO' | 'RANGO_MINIMO' | 'REGISTRO_ADICIONAL' | string;
  accion: AccionRegla;
  /** Clave de la opción que dispara la regla (tipo_regla: OPCION) */
  opcion?: string;
  /** Días de anticipación/antigüedad respecto a hoy (reglas de rango sobre fechas) */
  dias_relativos?: number;
  /** Fecha absoluta de una regla de rango sobre fechas (YYYY-MM-DD) */
  valor_fecha?: string;
  /**
   * Límite de una regla de rango sobre edad o número. Es estricto:
   * RANGO_MAXIMO 75 aplica desde 76, RANGO_MINIMO 5 aplica hasta 4.
   * En REGISTRO_ADICIONAL es el registro desde el que se cobra.
   */
  valor_numero?: number;
  /**
   * Regla de subcampo: si se cobra por cada registro que cumple la condición
   * (true) o una sola vez (false).
   */
  por_registro?: boolean;
  /** Monto o porcentaje a cobrar cuando accion es COBRAR */
  valor_adicional?: number;
  tipo_valor?: TipoValorRegla;
  /** Texto que verá el cliente en el detalle de cobro */
  concepto?: string;
  /** Texto que verá el cliente cuando la regla impide la venta */
  mensaje_rechazo?: string;
}

/** Tipos de `tipoInput` de un campo `input`. Los últimos son formatos heredados. */
export type TipoInput =
  | 'text'
  | 'textarea'
  | 'precio'
  | 'plano'
  | 'fecha'
  | 'ciudad'
  | 'number'
  | 'email'
  | 'date'
  | 'tel';

/** Claves comunes a todos los campos, sin importar su tipo */
export interface CampoBase {
  /** Identificador del campo: es lo que viaja en `campo_clave` de las respuestas */
  clave: string;
  nombre: string;
  requerido?: boolean;
  reglas?: ReglaCampo[];
}

export interface CampoInput extends CampoBase {
  tipo: 'input';
  tipoInput: TipoInput;
}

export interface CampoDropdown extends CampoBase {
  tipo: 'dropdown';
  opciones: OpcionCampo[];
}

export interface CampoMultiselect extends CampoBase {
  tipo: 'multiselect';
  opciones: OpcionCampo[];
}

export interface CampoGrupoInputs extends CampoBase {
  tipo: 'grupo_inputs';
  /**
   * Subcampos del registro. En el JSON del backend sus tipos son
   * `text` | `number` | `fecha` | `dropdown` | `edad`; el transformador los
   * normaliza al vocabulario de nivel 2.
   */
  campos: (CampoInput | CampoDropdown | CampoEdad)[];
  cantidad_maxima_registros?: number | null;
}

export interface CampoAutocomplete extends CampoBase {
  tipo: 'autocomplete';
  fuente: 'ciudades';
}

export interface CampoEdad extends CampoBase {
  tipo: 'edad';
  edadMinima?: number;
  edadMaxima?: number;
}

export type CampoAdicional = CampoInput | CampoDropdown | CampoMultiselect | CampoGrupoInputs | CampoAutocomplete | CampoEdad;

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
