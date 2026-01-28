/**
 * Tipos de datos para productos de seguros
 */

export interface ImagenAws {
  id: string;
  nombre: string;
  ruta: string;
  url?: string;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
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
  imagen?: ImagenAws;
}

export interface PaginatedProductos {
  data: Producto[];
  total: number;
}

export interface FindAllProductosParams {
  limit: number;
  offset: number;
}

export interface ProductoDetalle extends Producto {
  descripcionDetallada: string;
  coberturas: string[];
  requisitos: string[];
  beneficios: string[];
  documentosNecesarios?: string[];
}

export interface CategoriaProducto {
  id: string;
  nombre: string;
  descripcion: string;
  icono?: string;
  productos: Producto[];
}
