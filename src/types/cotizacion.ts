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

/**
 * Fila de `adicionales`: lo que respondió el cliente en un campo y lo que se le
 * cobró por esa respuesta.
 *
 * No todas las filas son cobros. Las de `concepto` null son respuestas que no
 * generaron cargo: sirven para repintar el formulario, no van en el desglose
 * (ver `lineasDeCobro` en `src/utils/adicionalesVenta.ts`).
 */
export interface AdicionalCotizacion {
  campo_clave: string;
  campo_nombre: string;
  /** Tipo del campo que originó la fila (dropdown, multiselect, edad…) */
  tipo_campo?: string | null;
  /** Clave de la opción elegida, en campos de selección */
  opcion_clave?: string | null;
  /** Clave del grupo cuando el campo vive dentro de un `grupo_inputs` */
  grupo_clave?: string | null;
  /** Registro del grupo que originó la fila; null cuando el campo no es de un grupo */
  numero_registro: number | null;
  /**
   * Lo que respondió el cliente. Es null en los cobros sintéticos (por ejemplo el
   * recargo por registro adicional), que el backend regenera solo al recotizar.
   */
  valor_campo?: string | null;
  /** Texto configurado por quien armó el plan: es la explicación del cargo */
  concepto: string | null;
  /** Monto del cobro. `valor` es el nombre viejo del mismo dato */
  valor_adicional?: number;
  /** @deprecated El backend lo manda como `valor_adicional` */
  valor?: number;
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
