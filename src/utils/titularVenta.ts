import type { CampoTitular, DatosTitular, TitularEnvio } from '../types/planes';
import { camposVisibles, textoDeValor, tipoPersonaTitular } from './camposTitular';

/**
 * Cómo sale el titular hacia el backend.
 *
 * Hay dos formas y una sola fuente: el estado del formulario, indexado por `clave`.
 *
 * - `titularParaEnvio` arma el objeto `titular` que ya recibe `POST /ventas/cotizar`,
 *   indexado por la misma `clave` de la configuración. Es el mismo objeto que va a
 *   recibir `POST /ventas` cuando salga la fase que vuelve dinámico el envío.
 * - `adaptarTitularAPayloadVenta` traduce ese estado a los campos fijos que el POST de
 *   venta sigue recibiendo hoy. Cuando reciba el objeto, se borra y se manda el de
 *   arriba; es la única frontera que hay que tocar.
 */

/**
 * Los valores del titular listos para enviar, indexados por `clave`.
 *
 * Solo van los campos que aplican al tipo de persona elegido, y los que el cliente no
 * llenó no van. El valor sale del estado tal como lo espera el backend: la clave de la
 * opción en un `DROPDOWN`, `YYYY-MM-DD` en `FECHA` y `EDAD`, el nombre de la ciudad en
 * `CIUDAD`, el texto en el resto.
 *
 * No se manda a medias: `POST /ventas/cotizar` rechaza con 422 los requeridos sin
 * responder (ver `CotizarVentaInput.titular`).
 */
export function titularParaEnvio(titular: DatosTitular, campos: CampoTitular[]): TitularEnvio {
  const payload: TitularEnvio = {};

  camposVisibles(campos, titular).forEach((campo) => {
    const valor = textoDeValor(titular?.[campo.clave]);
    if (valor === '') return;

    payload[campo.clave] = valor;
  });

  return payload;
}

/** Dónde va cada campo de sistema en el POST de venta actual */
const CAMPO_VENTA_POR_CLAVE_SISTEMA: Record<string, string> = {
  EMAIL: 'email',
  TIPO_DOCUMENTO: 'tipo_documento',
  NUMERO_DOCUMENTO: 'numero_documento',
  NOMBRES: 'nombres',
  APELLIDOS: 'apellidos',
  TELEFONO: 'telefono',
  TIPO_PERSONA: 'tipo_persona',
  NIT: 'nit',
  EMPRESA_NOMBRE: 'empresa_nombre',
  // La fecha de nacimiento se llama distinto en el payload
  FECHA_NACIMIENTO: 'dob',
};

/** Los datos del titular tal como los recibe hoy el POST de venta */
export interface TitularPayloadVenta {
  email?: string;
  tipo_documento?: string;
  numero_documento?: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  tipo_persona?: string;
  nit?: string;
  empresa_nombre?: string;
  dob?: string;
}

/**
 * Traduce el estado del titular (indexado por `clave`) a los campos fijos del POST
 * de venta.
 *
 * Solo viajan los campos con `clave_sistema` y que aplican al tipo de persona
 * elegido. **Un campo libre todavía no tiene dónde ir en el POST**: se renderiza y
 * se guarda en el estado, pero no se envía hasta que salga la fase del titular
 * dinámico.
 */
export function adaptarTitularAPayloadVenta(
  titular: DatosTitular,
  campos: CampoTitular[],
): TitularPayloadVenta {
  const payload: Record<string, string> = {};

  camposVisibles(campos, titular).forEach((campo) => {
    const destino = campo.clave_sistema
      ? CAMPO_VENTA_POR_CLAVE_SISTEMA[campo.clave_sistema]
      : undefined;
    if (!destino) return;

    const valor = textoDeValor(titular?.[campo.clave]);
    if (valor === '') return;

    payload[destino] = valor;
  });

  // El tipo de persona siempre viaja: si la versión no lo pide, se deduce igual que antes
  if (!payload.tipo_persona) {
    payload.tipo_persona = tipoPersonaTitular(titular, campos);
  }

  return payload;
}

/**
 * Contraseña con la que el cliente entra después de comprar. Hoy la landing no la
 * pide: es su número de documento (o el NIT / correo si la versión no lo configura).
 */
export function claveDeAccesoTitular(titular: DatosTitular, campos: CampoTitular[]): string {
  const payload = adaptarTitularAPayloadVenta(titular, campos);
  return payload.numero_documento || payload.nit || payload.email || '';
}
