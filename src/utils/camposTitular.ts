import type {
  CampoTitular,
  DatosTitular,
  OpcionCampoTitular,
  TipoCampoTitular,
} from '../types/planes';
import { DOCUMENT_TYPES } from './documentTypes';
import { nombreCiudad } from './respuestasCampos';

/**
 * Configuración del formulario del titular.
 *
 * Qué campos existen, en qué orden, con qué etiqueta y cuáles son obligatorios sale
 * de `version.campos_titular`. Acá solo vive lo que la landing sí sabe: los catálogos
 * de los dropdowns de sistema, la condicionalidad de persona natural/jurídica y las
 * validaciones de formato.
 */

/**
 * Con qué control se pinta cada tipo. El mapa es explícito a propósito: un tipo que
 * no esté acá no se pinta como texto libre —dejar escribir cualquier cosa donde va
 * una fecha o un número deja pasar basura hasta la venta— sino que bloquea el paso
 * (ver `validarCampoTitular`).
 *
 * `EDAD` y `FECHA` usan el mismo date picker: en los dos el cliente escribe su fecha
 * de nacimiento y se envía `YYYY-MM-DD`. La diferencia es solo cómo evalúa el backend
 * las reglas del campo.
 */
const CONTROLES_POR_TIPO = {
  TEXTO: 'texto',
  TEXTAREA: 'textarea',
  NUMERO: 'numero',
  FECHA: 'fecha',
  EDAD: 'fecha',
  CIUDAD: 'ciudad',
  DROPDOWN: 'select',
} as const satisfies Record<TipoCampoTitular, string>;

/** Control con el que el formulario pinta un campo */
export type ControlTitular = (typeof CONTROLES_POR_TIPO)[TipoCampoTitular];

const TIPOS_CAMPO_TITULAR = Object.keys(CONTROLES_POR_TIPO) as TipoCampoTitular[];

/** El control de un campo, o `null` si su tipo no se reconoce */
export function controlDeCampo(campo: CampoTitular): ControlTitular | null {
  return CONTROLES_POR_TIPO[campo.tipo as TipoCampoTitular] ?? null;
}

/** Un campo que la landing no sabe pintar: se muestra bloqueado y no deja continuar */
export function esCampoSoportado(campo: CampoTitular): boolean {
  return controlDeCampo(campo) !== null;
}

/**
 * Respaldo de los dropdowns de sistema. El GET ya manda sus `opciones` —y con las
 * mismas claves que acepta el POST de venta—, así que estos catálogos solo se usan
 * si un plan viejo llega sin ellas, para no pintar un select vacío.
 */
export const OPCIONES_TIPO_DOCUMENTO: OpcionCampoTitular[] = DOCUMENT_TYPES.map((documento) => ({
  clave: documento.tipo,
  etiqueta: documento.nombre,
}));

export const OPCIONES_TIPO_PERSONA: OpcionCampoTitular[] = [
  { clave: 'Natural', etiqueta: 'Natural' },
  { clave: 'Juridica', etiqueta: 'Jurídica' },
];

const CATALOGOS_DE_SISTEMA: Record<string, OpcionCampoTitular[]> = {
  TIPO_DOCUMENTO: OPCIONES_TIPO_DOCUMENTO,
  TIPO_PERSONA: OPCIONES_TIPO_PERSONA,
};

/** Campos que solo se le piden a una persona jurídica */
const CLAVES_SOLO_JURIDICA = ['NIT', 'EMPRESA_NOMBRE'];

/** Largo máximo de los campos de sistema que hoy lo tienen */
const MAX_LENGTH_POR_CLAVE_SISTEMA: Record<string, number> = {
  NUMERO_DOCUMENTO: 20,
  TELEFONO: 10,
  NIT: 15,
};

/* ------------------------------------------------------------------ *
 * Normalización de la configuración que llega con el plan
 * ------------------------------------------------------------------ */

function normalizarOpciones(opciones: any): OpcionCampoTitular[] {
  if (!Array.isArray(opciones)) return [];

  return opciones
    .map((opcion: any, indice: number) => ({
      ...(opcion?.id ? { id: String(opcion.id) } : {}),
      clave: String(opcion?.clave ?? opcion?.etiqueta ?? ''),
      etiqueta: String(opcion?.etiqueta ?? opcion?.clave ?? ''),
      orden: typeof opcion?.orden === 'number' ? opcion.orden : indice,
    }))
    .filter((opcion) => opcion.clave !== '')
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
}

/**
 * Deja los campos del titular listos para renderizar: descarta los que no traen
 * `clave` (sin ella no hay dónde guardar la respuesta) y los ordena por `orden`.
 *
 * `bloqueado` es información para el editor del admin: la landing lo ignora.
 */
export function normalizarCamposTitular(campos: any): CampoTitular[] {
  if (!Array.isArray(campos)) return [];

  return campos
    .filter((campo: any) => typeof campo?.clave === 'string' && campo.clave.trim() !== '')
    .map((campo: any, indice: number) => {
      const tipo = String(campo?.tipo ?? '');

      // El tipo se deja como llegó: si no lo conocemos, el campo se bloquea en vez de
      // pintarse como texto libre
      if (!TIPOS_CAMPO_TITULAR.includes(tipo as TipoCampoTitular)) {
        console.warn(
          `Tipo de campo de titular desconocido: "${tipo}" (campo "${campo.clave}"). ` +
          'No se puede capturar: revisa la configuración del plan.',
        );
      }

      return {
        id: String(campo.id ?? campo.clave),
        clave: campo.clave.trim(),
        clave_sistema: campo.clave_sistema ?? null,
        nombre: String(campo.nombre ?? campo.clave),
        tipo,
        requerido: campo.requerido === true,
        orden: typeof campo.orden === 'number' ? campo.orden : indice,
        restriccion_repetidos: campo.restriccion_repetidos === true,
        ambito_unicidad: campo.ambito_unicidad ?? null,
        ...(Array.isArray(campo.opciones) ? { opciones: normalizarOpciones(campo.opciones) } : {}),
        ...(Array.isArray(campo.reglas) && campo.reglas.length > 0 ? { reglas: campo.reglas } : {}),
      };
    })
    .sort((a, b) => a.orden - b.orden);
}

/* ------------------------------------------------------------------ *
 * Lectura del estado del titular
 * ------------------------------------------------------------------ */

/** Texto de un valor del formulario. La ciudad llega como objeto del autocomplete. */
export function textoDeValor(valor: any): string {
  if (valor === null || valor === undefined) return '';
  if (typeof valor === 'object') return nombreCiudad(valor);
  return String(valor).trim();
}

export function valorVacio(valor: any): boolean {
  return textoDeValor(valor) === '';
}

/** El campo configurado con esa `clave_sistema`, si la versión lo pide */
export function campoPorClaveSistema(
  campos: CampoTitular[],
  claveSistema: string,
): CampoTitular | undefined {
  return campos.find((campo) => campo.clave_sistema === claveSistema);
}

/** Lo que respondió el titular en el campo de esa `clave_sistema` */
export function valorPorClaveSistema(
  titular: DatosTitular,
  campos: CampoTitular[],
  claveSistema: string,
): string {
  const campo = campoPorClaveSistema(campos, claveSistema);
  return campo ? textoDeValor(titular?.[campo.clave]) : '';
}

/** Opciones a pintar: las que configuró el backend y, si no vinieran, el catálogo */
export function opcionesDeCampo(campo: CampoTitular): OpcionCampoTitular[] {
  if (campo.opciones && campo.opciones.length > 0) return campo.opciones;

  return (campo.clave_sistema ? CATALOGOS_DE_SISTEMA[campo.clave_sistema] : undefined) ?? [];
}

export function maxLengthDeCampo(campo: CampoTitular): number | undefined {
  return campo.clave_sistema ? MAX_LENGTH_POR_CLAVE_SISTEMA[campo.clave_sistema] : undefined;
}

/* ------------------------------------------------------------------ *
 * Condicionalidad de persona natural / jurídica
 *
 * La configuración dice si el campo existe y si es obligatorio, pero no dice que el
 * NIT solo aplica a una persona jurídica: esa sigue siendo lógica de la landing.
 * ------------------------------------------------------------------ */

/**
 * Tipo de persona del titular. Si la versión no pide TIPO_PERSONA se deduce del
 * tipo de documento, como se venía haciendo.
 */
export function tipoPersonaTitular(titular: DatosTitular, campos: CampoTitular[]): 'Natural' | 'Juridica' {
  const tipoPersona = valorPorClaveSistema(titular, campos, 'TIPO_PERSONA');
  if (tipoPersona) return /jur/i.test(tipoPersona) ? 'Juridica' : 'Natural';

  return valorPorClaveSistema(titular, campos, 'TIPO_DOCUMENTO') === 'NIT' ? 'Juridica' : 'Natural';
}

/** ¿Este campo aplica con el tipo de persona que eligió el titular? */
export function campoAplica(campo: CampoTitular, titular: DatosTitular, campos: CampoTitular[]): boolean {
  if (campo.clave_sistema && CLAVES_SOLO_JURIDICA.includes(campo.clave_sistema)) {
    return tipoPersonaTitular(titular, campos) === 'Juridica';
  }

  return true;
}

/** Los campos que se pintan (y se envían) con el estado actual del formulario */
export function camposVisibles(campos: CampoTitular[], titular: DatosTitular): CampoTitular[] {
  return campos.filter((campo) => campoAplica(campo, titular, campos));
}

/* ------------------------------------------------------------------ *
 * Formato de los valores
 * ------------------------------------------------------------------ */

/** El control del campo manda el formato: NUMERO solo dígitos, y los largos de sistema */
export function sanitizarValorTitular(campo: CampoTitular, valor: any): any {
  if (typeof valor !== 'string') return valor;

  let texto = valor;

  if (controlDeCampo(campo) === 'numero') {
    texto = texto.replace(/[^0-9]/g, '');
  } else if (campo.clave_sistema === 'NUMERO_DOCUMENTO') {
    texto = texto.replace(/[^a-zA-Z0-9]/g, '');
  } else if (campo.clave_sistema === 'NIT') {
    texto = texto.replace(/[^0-9-]/g, '');
  } else if (campo.clave_sistema === 'TELEFONO') {
    texto = texto.replace(/[^0-9]/g, '');
  }

  const maxLength = maxLengthDeCampo(campo);
  return maxLength ? texto.slice(0, maxLength) : texto;
}

const ES_FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;

function fechaValida(texto: string): boolean {
  if (!ES_FECHA_ISO.test(texto)) return false;
  const fecha = new Date(`${texto}T00:00:00`);
  return !isNaN(fecha.getTime());
}

/** Validación por control. `FECHA` y `EDAD` comparten el mismo formato: `YYYY-MM-DD`. */
function errorDeTipo(campo: CampoTitular, texto: string): string {
  const control = controlDeCampo(campo);

  if (control === 'numero' && !/^[0-9]+$/.test(texto)) {
    return `${campo.nombre} solo puede contener números`;
  }

  if (control === 'fecha' && !fechaValida(texto)) {
    return `${campo.nombre} no es una fecha válida`;
  }

  if (control === 'select') {
    const opciones = opcionesDeCampo(campo);
    if (opciones.length > 0 && !opciones.some((opcion) => opcion.clave === texto)) {
      return `Selecciona una opción válida en ${campo.nombre}`;
    }
  }

  return '';
}

/**
 * Mensaje de un campo que la landing no sabe pintar. Bloquea la compra a propósito:
 * capturarlo como texto libre guardaría cualquier cosa en un campo que esperaba otra.
 */
export const MENSAJE_CAMPO_NO_SOPORTADO =
  'No podemos capturar este dato en este momento. Comunícate con nosotros para completar tu compra.';

/** Validación de los campos que el sistema conoce, con las reglas de siempre */
function errorDeClaveSistema(campo: CampoTitular, texto: string): string {
  switch (campo.clave_sistema) {
    case 'EMAIL':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto) ? '' : 'El correo electrónico no es válido';

    case 'NUMERO_DOCUMENTO':
      if (texto.length < 5) return 'El número de documento debe tener al menos 5 caracteres';
      if (!/^[a-zA-Z0-9]+$/.test(texto)) return 'El número de documento solo puede contener letras y números';
      return '';

    case 'TELEFONO':
      if (!/^[0-9]+$/.test(texto)) return 'El teléfono solo puede contener números';
      if (texto.length < 7) return 'El teléfono debe tener al menos 7 dígitos';
      if (texto.length > 10) return 'El teléfono no debe exceder 10 dígitos';
      return '';

    case 'NIT':
      if (texto.length < 9) return 'El NIT debe tener al menos 9 caracteres';
      if (!/^[0-9-]+$/.test(texto)) return 'El NIT solo puede contener números y guión';
      return '';

    case 'NOMBRES':
    case 'APELLIDOS':
      return texto.length < 2 ? `${campo.nombre} debe tener al menos 2 caracteres` : '';

    case 'EMPRESA_NOMBRE':
      return texto.length < 3 ? `${campo.nombre} debe tener al menos 3 caracteres` : '';

    default:
      return '';
  }
}

/**
 * Error de un campo, o '' si está bien. Un campo que no aplica al tipo de persona
 * elegido nunca da error: `requerido` es "obligatorio cuando aplica".
 */
export function validarCampoTitular(
  campo: CampoTitular,
  titular: DatosTitular,
  campos: CampoTitular[],
): string {
  if (!campoAplica(campo, titular, campos)) return '';

  // Un tipo desconocido no se puede capturar: se avisa y no se deja continuar
  if (!esCampoSoportado(campo)) return MENSAJE_CAMPO_NO_SOPORTADO;

  const texto = textoDeValor(titular?.[campo.clave]);

  if (texto === '') return campo.requerido ? `${campo.nombre} es requerido` : '';

  return errorDeTipo(campo, texto) || errorDeClaveSistema(campo, texto);
}

/** Errores del formulario completo, indexados por `clave` del campo */
export function validarTitular(
  campos: CampoTitular[],
  titular: DatosTitular,
): Record<string, string> {
  const errores: Record<string, string> = {};

  campos.forEach((campo) => {
    const error = validarCampoTitular(campo, titular, campos);
    if (error) errores[campo.clave] = error;
  });

  return errores;
}

const valorInicial = (campo: CampoTitular): any => (controlDeCampo(campo) === 'select' ? null : '');

/**
 * Estado inicial del formulario: una entrada por campo configurado.
 *
 * De `previo` solo se rescata lo que sigue teniendo sentido con esta configuración.
 * Si la versión del plan cambió, lo que ya no se pide (o ya no es una opción válida)
 * se descarta: mandar el valor de un campo que la versión no configuró es mandar un
 * dato que no corresponde.
 */
export function estadoInicialTitular(campos: CampoTitular[], previo?: DatosTitular): DatosTitular {
  const titular: DatosTitular = {};

  campos.forEach((campo) => {
    const anterior = previo?.[campo.clave];

    if (anterior === undefined || valorVacio(anterior)) {
      titular[campo.clave] = valorInicial(campo);
      return;
    }

    titular[campo.clave] = errorDeTipo(campo, textoDeValor(anterior)) ? valorInicial(campo) : anterior;
  });

  return titular;
}

