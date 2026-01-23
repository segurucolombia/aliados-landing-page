import { apiClient } from './api.config';
import type { Producto, ProductoDetalle, CategoriaProducto } from '../types/productos';

/**
 * Servicio para manejar operaciones relacionadas con productos
 * Los endpoints serán configurados cuando estén disponibles
 */
export class ProductosService {
  /**
   * Obtiene la lista de todos los productos disponibles
   */
  static async getProductos(): Promise<Producto[]> {
    try {
      const response = await apiClient.get<Producto[]>('/productos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  /**
   * Obtiene el detalle de un producto específico
   */
  static async getProductoDetalle(id: string): Promise<ProductoDetalle> {
    try {
      const response = await apiClient.get<ProductoDetalle>(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalle del producto:', error);
      throw error;
    }
  }

  /**
   * Obtiene productos por categoría
   */
  static async getProductosPorCategoria(categoria: string): Promise<Producto[]> {
    try {
      const response = await apiClient.get<Producto[]>(`/productos/categoria/${categoria}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las categorías de productos
   */
  static async getCategorias(): Promise<CategoriaProducto[]> {
    try {
      const response = await apiClient.get<CategoriaProducto[]>('/productos/categorias');
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }
}
