import type {
  AdicionalCotizacion,
  CotizacionVenta,
  RespuestaCampo,
  ValorRespuesta,
} from '../types/cotizacion';
import type { VentaDetalle } from '../services/ventas.service';

/**
 * Lectura de `adicionales`, la lista que devuelven `GET /ventas/:id` y
 * `POST /ventas/cotizar`.
 *
 * Una fila puede ser dos cosas distintas: un **cobro** (tiene `concepto`) o la
 * **respuesta** que dio el cliente en un campo que no generó cargo. El desglose
 * solo muestra las primeras; las respuestas sirven para volver a cotizar.
 */

/** Monto del cobro de una fila. El backend lo manda como `valor_adicional`. */
export const montoAdicional = (adicional: AdicionalCotizacion): number =>
  adicional.valor_adicional ?? adicional.valor ?? 0;

/** Una fila es una línea del desglose solo si cobró algo */
export const esLineaDeCobro = (adicional: AdicionalCotizacion): boolean =>
  adicional.concepto != null && montoAdicional(adicional) > 0;

/** Las filas de `adicionales` que se le muestran al cliente como cobros */
export const lineasDeCobro = (adicionales: AdicionalCotizacion[] | null | undefined): AdicionalCotizacion[] =>
  (adicionales ?? []).filter(esLineaDeCobro);

/** Identifica al campo respondido: la clave y, en un grupo, el registro */
const claveDeRespuesta = (adicional: AdicionalCotizacion): string =>
  `${adicional.campo_clave}#${adicional.numero_registro ?? ''}`;

/**
 * Respuestas con las que se vuelve a cotizar una venta ya creada.
 *
 * Solo entran las filas con `valor_campo`: las demás son cobros sintéticos que el
 * backend regenera solo al recotizar (mandarlas cobraría dos veces). En campos de
 * selección se manda la clave de la opción, no el texto, y un campo que aparece
 * varias veces con el mismo registro es un multiselect: sus valores van en arreglo.
 */
export function respuestasDesdeAdicionales(
  adicionales: AdicionalCotizacion[] | null | undefined,
): RespuestaCampo[] {
  const respuestas: RespuestaCampo[] = [];
  const porCampo = new Map<string, RespuestaCampo>();

  (adicionales ?? [])
    .filter((adicional) => adicional.valor_campo != null)
    .forEach((adicional) => {
      const valor = (adicional.opcion_clave ?? adicional.valor_campo) as ValorRespuesta;
      const clave = claveDeRespuesta(adicional);
      const existente = porCampo.get(clave);

      if (!existente) {
        const respuesta: RespuestaCampo = {
          campo_clave: adicional.campo_clave,
          ...(adicional.numero_registro != null ? { numero_registro: adicional.numero_registro } : {}),
          valor,
        };
        porCampo.set(clave, respuesta);
        respuestas.push(respuesta);
        return;
      }

      // El campo ya venía respondido: son varias opciones de un multiselect
      existente.valor = Array.isArray(existente.valor)
        ? [...existente.valor, String(valor)]
        : [String(existente.valor), String(valor)];
    });

  return respuestas;
}

/**
 * Desglose de lo que ya quedó registrado en la venta, con la misma forma que una
 * cotización para poder pintarlo con `DesgloseCotizacion`.
 *
 * Los valores se toman tal cual vienen: el backend es la única fuente del precio.
 * La suma solo se usa como respaldo para ventas viejas, creadas antes de que el
 * backend guardara `valor_total`.
 */
export function cotizacionDeVenta(venta: VentaDetalle): CotizacionVenta {
  const valorVersion = venta.valor_version ?? venta.version_plan?.precio ?? 0;
  const valoresAdicionales = venta.valores_adicionales ?? 0;
  const valorDescuento = venta.valor_descuento ?? 0;

  return {
    version_id: venta.version_plan_id,
    valor_version: valorVersion,
    adicionales: lineasDeCobro(venta.adicionales),
    valores_adicionales: valoresAdicionales,
    codigo_descuento: venta.codigo_descuento,
    valor_descuento: valorDescuento,
    valor_total: venta.valor_total ?? Math.max(0, valorVersion + valoresAdicionales - valorDescuento),
  };
}

/** Forma canónica de una respuesta, para comparar dos conjuntos sin importar el orden */
const huellaDeRespuesta = (respuesta: RespuestaCampo): string => {
  const valor = Array.isArray(respuesta.valor)
    ? [...respuesta.valor].map(String).sort().join('|')
    : String(respuesta.valor);

  return `${respuesta.campo_clave}#${respuesta.numero_registro ?? ''}=${valor}`;
};

/** ¿Las respuestas del formulario son las mismas con las que se creó la venta? */
export function mismasRespuestas(unas: RespuestaCampo[], otras: RespuestaCampo[]): boolean {
  if (unas.length !== otras.length) return false;

  const huellas = unas.map(huellaDeRespuesta).sort();
  const otrasHuellas = otras.map(huellaDeRespuesta).sort();

  return huellas.every((huella, index) => huella === otrasHuellas[index]);
}
