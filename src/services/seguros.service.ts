import { apiClient } from './api.config';
import type { Seguro, SeguroDetalle, CotizacionRequest, CotizacionResponse } from '../types/seguros';

/**
 * Servicio para manejar operaciones relacionadas con seguros
 * Los endpoints serán configurados cuando estén disponibles
 */
export class SegurosService {
  /**
   * Obtiene la lista de todos los tipos de seguros disponibles
   */
  static async getTiposSeguros(): Promise<Seguro[]> {
    try {
      const response = await apiClient.get<Seguro[]>('/seguros/tipos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener tipos de seguros:', error);
      throw error;
    }
  }

  /**
   * Obtiene el detalle de un seguro específico
   */
  static async getSeguroDetalle(id: string): Promise<SeguroDetalle> {
    try {
      const response = await apiClient.get<SeguroDetalle>(`/seguros/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalle del seguro:', error);
      throw error;
    }
  }

  /**
   * Solicita una cotización de seguro
   */
  static async solicitarCotizacion(data: CotizacionRequest): Promise<CotizacionResponse> {
    try {
      const response = await apiClient.post<CotizacionResponse>('/seguros/cotizar', data);
      return response.data;
    } catch (error) {
      console.error('Error al solicitar cotización:', error);
      throw error;
    }
  }

  /**
   * Obtiene las coberturas disponibles para un tipo de seguro
   */
  static async getCoberturas(tipoSeguro: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`/seguros/${tipoSeguro}/coberturas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener coberturas:', error);
      throw error;
    }
  }
}
