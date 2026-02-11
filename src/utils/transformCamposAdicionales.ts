import type { CamposAdicionalesConfig, CampoAdicional } from '../types/planes';

/**
 * Transforma los campos adicionales del formato del backend al formato esperado por el frontend
 */
export function transformarCamposAdicionalesBackend(camposBackend: any): CamposAdicionalesConfig | undefined {
  if (!camposBackend || !camposBackend.secciones || camposBackend.secciones.length === 0) {
    return undefined;
  }

  const seccionesTransformadas = camposBackend.secciones.map((seccion: any) => {
    return {
      titulo: seccion.titulo,
      descripcion: seccion.descripcion,
      campos: seccion.campos.map((campo: any) => transformarCampo(campo))
    };
  });

  return {
    secciones: seccionesTransformadas
  };
}

function transformarCampo(campo: any): CampoAdicional {
  // Si es grupo_inputs, transformar recursivamente sus campos
  if (campo.tipo === 'grupo_inputs') {
    return {
      tipo: 'grupo_inputs',
      nombre: campo.nombre,
      requerido: campo.requerido !== false,
      campos: campo.campos.map((subcampo: any) => transformarCampo(subcampo))
    } as any;
  }

  // Si es dropdown
  if (campo.tipo === 'dropdown') {
    return {
      tipo: 'dropdown',
      nombre: campo.nombre,
      opciones: campo.opciones || [],
      requerido: campo.requerido !== false
    };
  }

  // Si es multiselect
  if (campo.tipo === 'multiselect') {
    return {
      tipo: 'multiselect',
      nombre: campo.nombre,
      opciones: campo.opciones || [],
      requerido: campo.requerido !== false
    };
  }

  // Si es autocomplete
  if (campo.tipo === 'autocomplete') {
    return {
      tipo: 'autocomplete',
      nombre: campo.nombre,
      fuente: campo.fuente || 'ciudades',
      requerido: campo.requerido !== false
    };
  }

  // Para otros tipos (text, number, email, date, tel, precio, plano)
  // El backend envía estos como tipo directo, pero nosotros necesitamos tipo: "input"
  const tiposInput = ['text', 'number', 'email', 'date', 'tel', 'precio', 'plano'];

  if (tiposInput.includes(campo.tipo)) {
    return {
      tipo: 'input',
      nombre: campo.nombre,
      tipoInput: campo.tipo,
      requerido: campo.requerido !== false
    };
  }

  // Si ya viene con el formato correcto (tipo: "input")
  if (campo.tipo === 'input') {
    return {
      tipo: 'input',
      nombre: campo.nombre,
      tipoInput: campo.tipoInput || 'text',
      requerido: campo.requerido !== false
    };
  }

  // Fallback: tratar como input text
  console.warn(`Tipo de campo desconocido: ${campo.tipo}. Usando input text como fallback.`);
  return {
    tipo: 'input',
    nombre: campo.nombre,
    tipoInput: 'text',
    requerido: campo.requerido !== false
  };
}
