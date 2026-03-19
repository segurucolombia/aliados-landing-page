import axios from 'axios';
import type { FindAllCategoriasParams, PaginatedCategorias } from '../types/categorias-productos';

const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/categorias-productos';

export class CategoriasProductosService {
  static async findAll(params: FindAllCategoriasParams = {}): Promise<PaginatedCategorias> {
    try {
      const response = await axios.get<PaginatedCategorias>(baseUrl, {
        params: {
          limit: params.limit ?? 10,
          offset: params.offset ?? 0,
          ...(params.estado !== undefined && { estado: params.estado }),
        },
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías de productos:', error);
      throw error;
    }
  }

  static async getActivas(limit = 5): Promise<PaginatedCategorias> {
    return this.findAll({ limit, offset: 0, estado: true });
  }
}
