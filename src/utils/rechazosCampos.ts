import type {
  CampoAdicional,
  CampoGrupoInputs,
  CamposAdicionalesConfig,
  CampoTitular,
} from '../types/planes';
import type { RechazoVenta } from '../types/cotizacion';

/**
 * Resolución de un `campo_clave` a la configuración que lo define.
 *
 * Los cobros y los rechazos que devuelve el backend pueden venir de un campo del
 * titular o de un campo adicional, y no traen ninguna marca que los distinga: solo
 * la clave. Para saber qué input marcar hay que buscarla en los dos bloques —primero
 * en `version.campos_titular`, después en `version.campos_adicionales`—. El backend
 * no deja repetir una clave entre las dos configuraciones, así que buscar en uno y
 * caer al otro es seguro.
 */

/** De cuál de las dos configuraciones salió el campo */
export type BloqueCampo = 'titular' | 'adicional';

export interface UbicacionCampo {
  bloque: BloqueCampo;
  clave: string;
  /** Etiqueta configurada para el campo */
  nombre: string;
  /** Índice de la sección, en un campo adicional */
  seccionIndex?: number;
  /** Clave del grupo, cuando el campo es subcampo de un `grupo_inputs` */
  grupoClave?: string;
}

/** Todos los campos adicionales, incluidos los subcampos de los grupos */
function recorrerCamposAdicionales(
  config: CamposAdicionalesConfig | null | undefined,
): UbicacionCampo[] {
  const ubicaciones: UbicacionCampo[] = [];

  (config?.secciones ?? []).forEach((seccion, seccionIndex) => {
    (seccion.campos ?? []).forEach((campo: CampoAdicional) => {
      ubicaciones.push({ bloque: 'adicional', clave: campo.clave, nombre: campo.nombre, seccionIndex });

      if (campo.tipo === 'grupo_inputs') {
        (campo as CampoGrupoInputs).campos.forEach((subcampo) => {
          ubicaciones.push({
            bloque: 'adicional',
            clave: subcampo.clave,
            nombre: subcampo.nombre,
            seccionIndex,
            grupoClave: campo.clave,
          });
        });
      }
    });
  });

  return ubicaciones;
}

/**
 * Dónde está definido un `campo_clave`, o `null` si no está en ninguna de las dos
 * configuraciones (una venta vieja, o una clave que el plan ya no pide).
 */
export function ubicarCampoPorClave(
  clave: string,
  camposTitular: CampoTitular[] | null | undefined,
  camposAdicionales: CamposAdicionalesConfig | null | undefined,
): UbicacionCampo | null {
  const titular = (camposTitular ?? []).find((campo) => campo.clave === clave);
  if (titular) return { bloque: 'titular', clave: titular.clave, nombre: titular.nombre };

  return recorrerCamposAdicionales(camposAdicionales).find((campo) => campo.clave === clave) ?? null;
}

/**
 * Reparte los rechazos entre los dos formularios para poder marcarlos en su input.
 *
 * Los que no se pueden ubicar quedan del lado de los adicionales: ahí no van a
 * coincidir con ningún campo, pero igual se le muestran al cliente en el desglose,
 * que lista todos los rechazos con su mensaje.
 */
export function separarRechazos(
  rechazos: RechazoVenta[],
  camposTitular: CampoTitular[] | null | undefined,
  camposAdicionales: CamposAdicionalesConfig | null | undefined,
): { titular: RechazoVenta[]; adicionales: RechazoVenta[] } {
  const titular: RechazoVenta[] = [];
  const adicionales: RechazoVenta[] = [];

  rechazos.forEach((rechazo) => {
    const ubicacion = ubicarCampoPorClave(rechazo.campo_clave, camposTitular, camposAdicionales);
    if (ubicacion?.bloque === 'titular') {
      titular.push(rechazo);
    } else {
      adicionales.push(rechazo);
    }
  });

  return { titular, adicionales };
}

/**
 * Mensaje del backend para un campo, tal cual lo escribió quien configuró la regla.
 * En un subcampo de grupo hay que pasar el `numero_registro` al que corresponde.
 */
export function mensajeDeRechazo(
  rechazos: RechazoVenta[] | null | undefined,
  clave: string,
  numeroRegistro?: number | null,
): string {
  return (rechazos ?? []).find(
    (rechazo) => rechazo.campo_clave === clave
      && (numeroRegistro === undefined || (rechazo.numero_registro ?? null) === (numeroRegistro ?? null)),
  )?.mensaje ?? '';
}

/* ------------------------------------------------------------------ *
 * Problemas del titular al crear la venta (422 con `problemas`)
 * ------------------------------------------------------------------ */

/** Compara nombres de campo sin distinguir mayúsculas ni tildes */
const normalizar = (texto: string): string =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

/** Los textos entrecomillados de un problema, en el orden en que aparecen */
const entrecomillados = (problema: string): string[] =>
  [...problema.matchAll(/"([^"]+)"|“([^”]+)”/g)].map((coincidencia) => coincidencia[1] ?? coincidencia[2]);

/**
 * A qué campo se refiere un problema. Los mensajes vienen escritos para el cliente y
 * nombran el campo entre comillas (`"Teléfono" es obligatorio`), a veces después del
 * valor inválido (`"XX" no es una opción válida de "Tipo de documento"`): por eso se
 * busca de atrás para adelante, que es donde queda el nombre del campo.
 */
function campoDeProblema(
  problema: string,
  camposTitular: CampoTitular[] | null | undefined,
  camposAdicionales: CamposAdicionalesConfig | null | undefined,
): UbicacionCampo | null {
  const candidatos = entrecomillados(problema).reverse();

  for (const candidato of candidatos) {
    const nombre = normalizar(candidato);

    const titular = (camposTitular ?? []).find((campo) => normalizar(campo.nombre) === nombre);
    if (titular) return { bloque: 'titular', clave: titular.clave, nombre: titular.nombre };

    const adicional = recorrerCamposAdicionales(camposAdicionales).find(
      (campo) => normalizar(campo.nombre) === nombre,
    );
    if (adicional) return adicional;
  }

  return null;
}

/**
 * Convierte los `problemas` de un 422 de venta en rechazos por campo, para marcarlos
 * en el formulario igual que los que devuelve cotizar.
 *
 * Los que no se pueden ubicar (porque el mensaje no nombra ningún campo conocido)
 * salen en `sinUbicar`: hay que mostrárselos al cliente igual, en el mensaje general.
 */
export function rechazosDesdeProblemas(
  problemas: string[],
  camposTitular: CampoTitular[] | null | undefined,
  camposAdicionales: CamposAdicionalesConfig | null | undefined,
): { rechazos: RechazoVenta[]; sinUbicar: string[] } {
  const rechazos: RechazoVenta[] = [];
  const sinUbicar: string[] = [];

  problemas.forEach((problema) => {
    const campo = campoDeProblema(problema, camposTitular, camposAdicionales);

    if (campo) {
      rechazos.push({ campo_clave: campo.clave, campo_nombre: campo.nombre, mensaje: problema });
    } else {
      sinUbicar.push(problema);
    }
  });

  return { rechazos, sinUbicar };
}
