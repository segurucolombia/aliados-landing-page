/**
 * Tipos de datos para productos de seguros
 * Estos tipos serán actualizados cuando se integren los endpoints
 */

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  categoria?: string;
  precio?: number;
  caracteristicas?: string[];
  activo: boolean;
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
