/**
 * Tipos de datos para productos de seguros
 */

export interface ImagenAws {
  id: string;
  nombre: string;
  ruta?: string;
  url?: string;
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
}

export interface CategoriaProducto {
  id: string;
  nombre: string;
  descripcion?: string;
  icono?: string;
  estado?: boolean;
  created_at?: Date;
  created_by?: string;
  updated_at?: Date;
  updated_by?: string;
  productos?: Producto[];
}

export interface EstilosAseguradora {
  id: string;
  aseguradora_id: string;
  color_primario: string;
  color_secundario: string;
  logo?: string | null;
  logo_imagen?: ImagenAws | null;
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
  imagen?: ImagenAws;
  categoria?: CategoriaProducto;
  aseguradora?: Aseguradora;
  planes_totales?: number;
  planes_activos?: number;
}

export interface ProductoFindResponse {
  success: boolean;
  data: Producto;
}

export interface PaginatedProductos {
  data: Producto[];
  total: number;
}

export interface FindAllProductosParams {
  limit: number;
  offset: number;
  estado?: boolean;
  categoria_id?: string;
}

export interface ProductoDetalle extends Producto {
  descripcionDetallada?: string;
  coberturas?: string[];
  requisitos?: string[];
  beneficios?: string[];
  documentosNecesarios?: string[];
}
