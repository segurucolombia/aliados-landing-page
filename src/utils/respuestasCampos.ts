import type { CampoAdicional, CampoGrupoInputs, SeccionCamposAdicionales } from '../types/planes';
import type { RespuestaCampo, ValorRespuesta } from '../types/cotizacion';

/**
 * Arma el arreglo `respuestas` que se manda a `POST /ventas/cotizar` y a
 * `POST /ventas` a partir del estado del formulario.
 *
 * El estado está indexado por posición de sección y por `clave` del campo:
 * `datosFormulario[indiceSeccion][claveCampo]`.
 */

/** Estado del formulario tal como lo guarda el componente de campos adicionales */
export type DatosFormulario = Record<number, Record<string, any>>;

/** Texto legible de un valor de ciudad (viene como objeto del autocomplete) */
export const nombreCiudad = (valor: any): string => {
  if (!valor) return '';
  if (typeof valor === 'string') return valor;
  return valor.name || valor.nombre || '';
};

const esCampoDeCiudad = (campo: CampoAdicional): boolean =>
  campo.tipo === 'autocomplete' || (campo.tipo === 'input' && campo.tipoInput === 'ciudad');

/**
 * Valor de un campo tal como lo espera el backend, o `null` si está sin responder
 * (una cadena vacía cuenta como no respondida).
 */
export function valorParaRespuesta(campo: CampoAdicional, valor: any): ValorRespuesta | null {
  if (campo.tipo === 'multiselect') {
    // Un multiselect manda el arreglo de claves de opción
    return Array.isArray(valor) && valor.length > 0 ? valor : null;
  }

  if (esCampoDeCiudad(campo)) {
    const nombre = nombreCiudad(valor);
    return nombre === '' ? null : nombre;
  }

  if (valor === null || valor === undefined || valor === '') return null;

  if (campo.tipo === 'input' && (campo.tipoInput === 'precio' || campo.tipoInput === 'plano')) {
    const numero = Number(valor);
    return isNaN(numero) ? null : numero;
  }

  // El campo `edad` se manda como fecha de nacimiento (YYYY-MM-DD): el backend
  // calcula los años. Los demás campos van tal cual.
  return valor;
}

/**
 * ¿El cliente empezó a llenar este registro? El backend deduce cuántos registros
 * tiene un grupo de las respuestas que recibe: un registro existe desde que
 * **cualquiera** de sus subcampos tiene valor, y ahí sus subcampos `requerido`
 * pasan a ser obligatorios.
 */
export function registroTieneDatos(grupo: CampoGrupoInputs, entrada: Record<string, any>): boolean {
  return grupo.campos.some((subcampo) => valorParaRespuesta(subcampo, entrada?.[subcampo.clave]) !== null);
}

/**
 * Número que le corresponde a cada registro en las respuestas, o `null` si el
 * registro está en blanco y no se manda.
 *
 * Los `numero_registro` van 1..N corridos, sin huecos: un registro en blanco en
 * el medio no consume número, y al eliminar uno los siguientes se renumeran.
 */
export function numerosDeRegistro(
  grupo: CampoGrupoInputs,
  registros: Record<string, any>[],
): (number | null)[] {
  let numero = 0;
  return registros.map((entrada) => (registroTieneDatos(grupo, entrada) ? ++numero : null));
}

/**
 * Una entrada por campo respondido. Los subcampos de un grupo llevan
 * `numero_registro` empezando en 1; los campos de nivel 2 no lo llevan.
 */
export function construirRespuestas(
  secciones: SeccionCamposAdicionales[],
  datosFormulario: DatosFormulario,
): RespuestaCampo[] {
  const respuestas: RespuestaCampo[] = [];

  secciones.forEach((seccion, seccionIndex) => {
    seccion.campos.forEach((campo) => {
      const valor = datosFormulario[seccionIndex]?.[campo.clave];

      if (campo.tipo === 'grupo_inputs') {
        const grupo = campo as CampoGrupoInputs;
        const registros: Record<string, any>[] = Array.isArray(valor) ? valor : [];
        const numeros = numerosDeRegistro(grupo, registros);

        registros.forEach((entrada, index) => {
          const numeroRegistro = numeros[index];
          if (numeroRegistro === null) return; // registro en blanco: no existe

          grupo.campos.forEach((subcampo) => {
            const valorSubcampo = valorParaRespuesta(subcampo, entrada?.[subcampo.clave]);
            if (valorSubcampo === null) return;

            respuestas.push({
              campo_clave: subcampo.clave,
              numero_registro: numeroRegistro,
              valor: valorSubcampo,
            });
          });
        });
        return;
      }

      const valorCampo = valorParaRespuesta(campo, valor);
      if (valorCampo === null) return;

      respuestas.push({ campo_clave: campo.clave, valor: valorCampo });
    });
  });

  return respuestas;
}
