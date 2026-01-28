import axios from "axios";
import type { FindAllProductosParams, PaginatedProductos, Producto, ProductoDetalle, CategoriaProducto } from '../types/productos';

const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/productos';

/**
 * Servicio para manejar operaciones relacionadas con productos
 */
export class ProductosService {
  /**
   * Obtiene la lista paginada de productos
   */
  static async findAll(params: FindAllProductosParams): Promise<PaginatedProductos> {
    try {
      const response = await axios.get<PaginatedProductos>(`${baseUrl}`, {
        params: {
          limit: params.limit,
          offset: params.offset
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
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
      const response = await axios.get<ProductoDetalle>(`${baseUrl}/${id}`);
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
      const response = await axios.get<Producto[]>(`${baseUrl}/categoria/${categoria}`);
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
      const response = await axios.get<CategoriaProducto[]>(`${baseUrl}/categorias`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }
}
