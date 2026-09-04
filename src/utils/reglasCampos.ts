import type { CampoAdicional, CampoTitular, ReglaCampo } from '../types/planes';
import { formatPriceNoDecimal } from '../shared/priceFormat';

/**
 * Un campo con reglas configuradas. Son las mismas para los dos formularios: los
 * campos adicionales (el riesgo) y los del titular, que también pueden tener
 * recargos y rechazos.
 */
export type CampoConReglas = CampoAdicional | CampoTitular;

/**
 * Lectura de las `reglas` de un campo para anticiparle al cliente lo que va a costar
 * cada respuesta *antes* de que llene todo el formulario.
 *
 * Es solo presentación: el total y los cargos reales los calcula el backend en
 * `POST /ventas/cotizar`. Por eso acá nunca se convierte un porcentaje a pesos.
 */

const reglasDe = (campo: any): ReglaCampo[] => (Array.isArray(campo?.reglas) ? campo.reglas : []);

const esCobro = (regla: ReglaCampo): boolean => regla.accion === 'COBRAR';
const esRechazo = (regla: ReglaCampo): boolean => regla.accion === 'RECHAZAR';

/** "+ $50.000" para un valor fijo, "+ 10% del plan" para un porcentaje */
export function formatearRecargo(regla: ReglaCampo): string {
  const valor = regla.valor_adicional;
  if (valor == null) return '';

  if (regla.tipo_valor === 'PORCENTAJE') return `+ ${valor}% del plan`;
  return `+ ${formatPriceNoDecimal(valor)}`;
}

/** Recargo que agrega elegir una opción concreta de un dropdown/multiselect */
export function recargoDeOpcion(campo: CampoConReglas, claveOpcion: string): string {
  const regla = reglasDe(campo).find(
    (r) => r.tipo_regla === 'OPCION' && r.opcion === claveOpcion && esCobro(r),
  );
  return regla ? formatearRecargo(regla) : '';
}

/** Mensaje de la regla que impide vender cuando se elige esa opción */
export function rechazoDeOpcion(campo: CampoConReglas, claveOpcion: string): string {
  const regla = reglasDe(campo).find(
    (r) => r.tipo_regla === 'OPCION' && r.opcion === claveOpcion && esRechazo(r),
  );
  return regla ? (regla.mensaje_rechazo || 'No disponible') : '';
}

/**
 * Aviso del recargo que ya disparó la opción elegida, con el concepto que configuró
 * el aliado: "Recargo persona jurídica: + 10% del plan". Va debajo del control, igual
 * que el de la fecha de nacimiento; el de `recargoDeOpcion` va dentro de la lista.
 */
export function avisoDeOpcionElegida(campo: CampoConReglas, claveOpcion: string): string {
  const regla = reglasDe(campo).find(
    (r) => r.tipo_regla === 'OPCION' && r.opcion === claveOpcion && esCobro(r),
  );
  return regla ? textoDeRecargo(regla) : '';
}

/**
 * Aviso para el botón de agregar de un grupo:
 * "Desde el 2º vehículo: + $15.000 c/u"
 */
export function recargoRegistroAdicional(campo: CampoConReglas, nombreRegistro?: string): string {
  const regla = reglasDe(campo).find((r) => r.tipo_regla === 'REGISTRO_ADICIONAL' && esCobro(r));
  if (!regla) return '';

  const desde = regla.valor_numero ?? 2;
  const etiqueta = nombreRegistro || 'registro';
  return `Desde el ${desde}º ${etiqueta}: ${formatearRecargo(regla)} c/u`;
}

/**
 * Recargos del campo que no dependen de una opción puntual (rangos de fecha, de valor…).
 * Se muestran como nota debajo del control, con el concepto que configuró el aliado.
 */
export function avisosDeRecargo(campo: CampoConReglas): string[] {
  return reglasDe(campo)
    .filter((r) => esCobro(r) && r.tipo_regla !== 'OPCION' && r.tipo_regla !== 'REGISTRO_ADICIONAL')
    .map((r) => textoDeRecargo(r))
    .filter((texto) => texto !== '');
}

/**
 * Condiciones del campo que impiden la venta y no dependen de una opción puntual.
 * Se avisan de entrada; el rechazo real lo decide el backend.
 */
export function avisosDeRechazo(campo: CampoConReglas): string[] {
  return reglasDe(campo)
    .filter((r) => esRechazo(r) && r.tipo_regla !== 'OPCION')
    .map((r) => r.mensaje_rechazo || '')
    .filter((mensaje) => mensaje !== '');
}

/** ¿El campo tiene algo configurado que valga la pena avisar junto al control? */
export function tieneReglas(campo: CampoConReglas): boolean {
  return reglasDe(campo).length > 0;
}

/** "Concepto: + $32.500", con la aclaración de si se cobra una sola vez */
function textoDeRecargo(regla: ReglaCampo): string {
  const monto = formatearRecargo(regla);
  if (!monto) return '';

  // `por_registro: false` en una regla de subcampo significa que el recargo se
  // cobra una sola vez aunque varios registros cumplan la condición
  const aclaracion = regla.por_registro === false ? ' (una sola vez)' : '';
  return [regla.concepto, monto].filter(Boolean).join(': ') + aclaracion;
}

/* ------------------------------------------------------------------ *
 * Campos de tipo `edad`
 *
 * Se capturan como fecha de nacimiento: en la renovación la venta se recotiza
 * con las respuestas guardadas y la edad se recalcula sola.
 * ------------------------------------------------------------------ */

/**
 * Interpreta un `YYYY-MM-DD` en la zona horaria local. `new Date(iso)` lo lee como
 * UTC y en Colombia eso adelanta la fecha un día, que en un cumpleaños es un año
 * de diferencia en la edad.
 */
function parsearFechaLocal(fecha: string): Date {
  const partes = /^(\d{4})-(\d{2})-(\d{2})/.exec(fecha);
  if (!partes) return new Date(fecha);
  return new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]));
}

/** Edad en años cumplidos a la fecha actual */
export function calcularEdad(fechaNacimiento: string, hoy: Date = new Date()): number {
  const nacimiento = parsearFechaLocal(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const meses = hoy.getMonth() - nacimiento.getMonth();
  if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
}

const aISO = (fecha: Date): string => {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
};

const restarAnios = (fecha: Date, anios: number): Date =>
  new Date(fecha.getFullYear() - anios, fecha.getMonth(), fecha.getDate());

/**
 * Límite de edad configurado, con la acción que decide qué hacer al salirse:
 * la regla es la que manda, no `edadMinima` / `edadMaxima`.
 */
interface LimiteEdad {
  anios: number;
  regla?: ReglaCampo;
  /** Sin regla sobre el límite es validación pura: se bloquea */
  bloquea: boolean;
}

function limiteEdad(campo: any, tipo: 'RANGO_MINIMO' | 'RANGO_MAXIMO'): LimiteEdad | null {
  const regla = reglasDe(campo).find((r) => r.tipo_regla === tipo);
  const anios = regla?.valor_numero ?? (tipo === 'RANGO_MINIMO' ? campo?.edadMinima : campo?.edadMaxima);
  if (anios == null) return null;

  return { anios, regla, bloquea: !regla || esRechazo(regla) };
}

/**
 * Rango seleccionable del datepicker de fecha de nacimiento.
 *
 * `edadMinima` / `edadMaxima` NO son topes duros: solo se bloquea el rango cuyo
 * límite tiene una regla `RECHAZAR` (o ninguna regla). Si la regla es `COBRAR`,
 * la fecha se permite y el recargo se muestra junto al campo.
 */
export function limitesFechaNacimiento(
  campo: CampoConReglas,
  hoy: Date = new Date(),
): { min?: string; max?: string } {
  const limites: { min?: string; max?: string } = {};

  // Nadie nace en el futuro
  limites.max = aISO(hoy);

  const minimo = limiteEdad(campo, 'RANGO_MINIMO');
  if (minimo?.bloquea) {
    // El límite es estricto: con edadMinima 5, los de 5 pasan y se bloquea hasta 4
    limites.max = aISO(restarAnios(hoy, minimo.anios));
  }

  const maximo = limiteEdad(campo, 'RANGO_MAXIMO');
  if (maximo?.bloquea) {
    // RANGO_MAXIMO 75 bloquea desde 76: la fecha más antigua permitida es la del
    // día siguiente a cumplir 76 años
    const limite = restarAnios(hoy, maximo.anios + 1);
    limite.setDate(limite.getDate() + 1);
    limites.min = aISO(limite);
  }

  return limites;
}

/**
 * Qué implica la fecha de nacimiento elegida: los recargos que dispara y los
 * motivos por los que no se podría vender. El cobro real lo decide el backend.
 */
export function evaluarReglasEdad(
  campo: CampoConReglas,
  fechaNacimiento: string,
  hoy: Date = new Date(),
): { recargos: string[]; rechazos: string[] } {
  const recargos: string[] = [];
  const rechazos: string[] = [];

  if (!fechaNacimiento) return { recargos, rechazos };

  const edad = calcularEdad(fechaNacimiento, hoy);

  const evaluar = (limite: LimiteEdad | null, seSale: boolean, mensajeSinRegla: string): void => {
    if (!limite || !seSale) return;

    if (limite.regla && esCobro(limite.regla)) {
      const texto = textoDeRecargo(limite.regla);
      if (texto) recargos.push(texto);
      return;
    }

    rechazos.push(limite.regla?.mensaje_rechazo || mensajeSinRegla);
  };

  const minimo = limiteEdad(campo, 'RANGO_MINIMO');
  evaluar(minimo, minimo != null && edad < minimo.anios, `La edad mínima es ${minimo?.anios} años`);

  const maximo = limiteEdad(campo, 'RANGO_MAXIMO');
  evaluar(maximo, maximo != null && edad > maximo.anios, `La edad máxima es ${maximo?.anios} años`);

  return { recargos, rechazos };
}
