import type {
  CamposAdicionalesConfig,
  CampoAdicional,
  OpcionCampo,
  ReglaCampo,
  TipoInput,
} from '../types/planes';

/**
 * Normaliza la configuración de campos adicionales que viene en la versión del plan.
 *
 * El backend manda tres niveles (secciones → campos → campos de grupo) y usa dos
 * vocabularios de tipos: el de nivel 2 (`input` + `tipoInput`, `dropdown`, ...) y el
 * de los subcampos de un grupo (`text`, `number`, `fecha`, `dropdown`). Acá todo
 * queda en el vocabulario de nivel 2 para que el formulario renderice un solo modelo.
 *
 * Se preservan `clave` y `reglas`, que son lo que necesita la cotización.
 */
export function transformarCamposAdicionalesBackend(camposBackend: any): CamposAdicionalesConfig | undefined {
  if (!camposBackend || !camposBackend.secciones || camposBackend.secciones.length === 0) {
    return undefined;
  }

  const seccionesTransformadas = camposBackend.secciones.map((seccion: any) => ({
    titulo: seccion.titulo,
    descripcion: seccion.descripcion,
    campos: (seccion.campos || []).map((campo: any) => transformarCampo(campo)),
  }));

  return { secciones: seccionesTransformadas };
}

/** Tipos que el backend puede mandar como `tipo` directo y acá son un `input` */
const TIPOS_INPUT: Record<string, TipoInput> = {
  text: 'text',
  textarea: 'textarea',
  precio: 'precio',
  plano: 'plano',
  // Los subcampos de un grupo dicen "number" donde el nivel 2 dice tipoInput "plano"
  number: 'plano',
  fecha: 'fecha',
  date: 'fecha',
  ciudad: 'ciudad',
  email: 'email',
  tel: 'tel',
};

/**
 * Clave del campo: es lo que viaja en `campo_clave`. Si la configuración es vieja y
 * no la trae, se deriva del nombre para no romper el formulario.
 */
function resolverClave(campo: any): string {
  if (typeof campo?.clave === 'string' && campo.clave.trim() !== '') return campo.clave;

  return String(campo?.nombre ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function resolverRequerido(campo: any): boolean {
  // Prioridad a "obligatorio" (nombre que usó el backend antes)
  if (campo?.obligatorio === true) return true;
  if (campo?.obligatorio === false) return false;

  if (campo?.requerido === true) return true;
  if (campo?.requerido === false) return false;

  // Las claves de un campo son exclusivas de su tipo: si no viene la bandera,
  // el campo no es obligatorio. La obligatoriedad real la valida el backend.
  return false;
}

/**
 * Las opciones vienen como `{ clave, etiqueta }`. Las configuraciones viejas mandaban
 * strings sueltos; ahí la etiqueta hace también de clave.
 */
function normalizarOpciones(opciones: any): OpcionCampo[] {
  if (!Array.isArray(opciones)) return [];

  return opciones.map((opcion: any) => {
    if (typeof opcion === 'string') return { clave: opcion, etiqueta: opcion };

    const clave = opcion?.clave ?? opcion?.value ?? opcion?.etiqueta ?? '';
    const etiqueta = opcion?.etiqueta ?? opcion?.label ?? opcion?.clave ?? '';
    return { clave: String(clave), etiqueta: String(etiqueta) };
  });
}

/** Las reglas se pasan tal cual: solo se usan para anticiparle el cargo al cliente */
function normalizarReglas(reglas: any): ReglaCampo[] | undefined {
  if (!Array.isArray(reglas) || reglas.length === 0) return undefined;
  return reglas as ReglaCampo[];
}

/** Claves comunes a cualquier tipo de campo */
function base(campo: any) {
  return {
    clave: resolverClave(campo),
    nombre: campo.nombre,
    requerido: resolverRequerido(campo),
    ...(normalizarReglas(campo.reglas) ? { reglas: normalizarReglas(campo.reglas) } : {}),
  };
}

function transformarCampo(campo: any): CampoAdicional {
  if (campo.tipo === 'grupo_inputs') {
    return {
      ...base(campo),
      tipo: 'grupo_inputs',
      cantidad_maxima_registros: campo.cantidad_maxima_registros ?? null,
      campos: (campo.campos || []).map((subcampo: any) => transformarCampo(subcampo)),
    } as CampoAdicional;
  }

  if (campo.tipo === 'dropdown') {
    return { ...base(campo), tipo: 'dropdown', opciones: normalizarOpciones(campo.opciones) };
  }

  if (campo.tipo === 'multiselect') {
    return { ...base(campo), tipo: 'multiselect', opciones: normalizarOpciones(campo.opciones) };
  }

  if (campo.tipo === 'autocomplete') {
    return { ...base(campo), tipo: 'autocomplete', fuente: campo.fuente || 'ciudades' };
  }

  if (campo.tipo === 'edad') {
    return {
      ...base(campo),
      tipo: 'edad',
      edadMinima: campo.edadMinima,
      edadMaxima: campo.edadMaxima,
    };
  }

  // Tipo mandado directo (subcampos de grupo y configuraciones viejas)
  if (TIPOS_INPUT[campo.tipo]) {
    return { ...base(campo), tipo: 'input', tipoInput: TIPOS_INPUT[campo.tipo] };
  }

  if (campo.tipo === 'input') {
    return {
      ...base(campo),
      tipo: 'input',
      tipoInput: TIPOS_INPUT[campo.tipoInput] || 'text',
    };
  }

  console.warn(`Tipo de campo desconocido: ${campo.tipo}. Usando input text como fallback.`);
  return { ...base(campo), tipo: 'input', tipoInput: 'text' };
}
