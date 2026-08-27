/**
 * Tipos de la cotización de una venta (`POST /api-aliados/ventas/cotizar`).
 *
 * La landing nunca calcula el precio: arma las respuestas del formulario,
 * las manda a cotizar y pinta el desglose que devuelve el backend.
 */

/** Valor de un campo respondido. Los multiselect mandan un arreglo de claves. */
export type ValorRespuesta = string | number | string[];

/**
 * Una entrada por campo respondido. `numero_registro` solo va en los subcampos
 * de un `grupo_inputs` y empieza en 1.
 */
export interface RespuestaCampo {
  campo_clave: string;
  numero_registro?: number;
  valor: ValorRespuesta;
}

export interface CotizarVentaInput {
  version_id: string;
  codigo_descuento?: string;
  debito_automatico?: boolean;
  respuestas: RespuestaCampo[];
}

/** Línea del detalle de cobro: un cargo que se le suma al precio del plan */
export interface AdicionalCotizacion {
  campo_clave: string;
  campo_nombre: string;
  /** Registro del grupo que originó el cargo; null cuando el campo no es de un grupo */
  numero_registro: number | null;
  /** Texto configurado por quien armó el plan: es la explicación del cargo */
  concepto: string;
  valor: number;
}

export interface CotizacionVenta {
  version_id: string;
  valor_version: number;
  adicionales: AdicionalCotizacion[];
  valores_adicionales: number;
  codigo_descuento?: string | null;
  valor_descuento: number;
  /** Único valor que se cobra: valor_version + valores_adicionales - valor_descuento */
  valor_total: number;
}

export interface CotizarVentaResponse {
  success: boolean;
  data: CotizacionVenta;
}

/** Motivo por el que la venta no se puede hacer con los datos ingresados (HTTP 422) */
export interface RechazoVenta {
  campo_clave: string;
  campo_nombre: string;
  /** Registro del grupo al que corresponde el motivo, cuando aplica */
  numero_registro?: number | null;
  /** Mensaje escrito para que lo lea el cliente */
  mensaje: string;
}

export interface RechazoVentaResponse {
  success: false;
  message: string;
  rechazos: RechazoVenta[];
}
