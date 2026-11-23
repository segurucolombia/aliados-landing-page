/**
 * Configuración y textos del Club SEGURU.
 *
 * Todos los textos legales viven aquí para que legal los revise en un solo lugar.
 * Fuente: "Política de tratamiento de datos personales" de GRUPO IGO COLOMBIA S.A.S.,
 * versión 2.1 del 12 de noviembre de 2026.
 */

/** WhatsApp de SEGURU (el mismo de Hero.vue y ProductosView.vue) */
export const WHATSAPP_NUMERO = '573154603134';

export const whatsappUrl = (mensaje = 'Hola, quiero información sobre los planes de SEGURU.'): string =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;

/**
 * Datos del prototipo que todavía no tienen fuente (costo de un servicio exequial,
 * espera de una cita en la EPS, testimonios y cifras de familias).
 * TODO(fuente): no encender hasta tener la fuente de cada dato.
 */
export const MOSTRAR_DATOS_SIN_VALIDAR = false;

export const CLUB = {
  nombre: 'Club SEGURU',
  etiquetaInvitado: 'Club SEGURU · Gratis',
  etiquetaMiembro: 'Miembro del Club ✓',
  tituloContratar: 'Último paso antes de contratar',
  textoContratar: 'Para contratar necesitas ser parte del Club SEGURU. Es gratis y toma menos de un minuto.',
  pasosContratar: ['Únete (gratis)', 'Elige y paga'],
  preciosPublicos: 'Los precios son públicos. Para contratar, te unes al Club: es gratis.',
  bandaPrecios: 'Para contratar, únete al Club. Es gratis.',
  /** Página del Club (sin sesión): los precios se ven al entrar al Club */
  preciosMiembros: 'Únete gratis al Club para ver los precios y contratar.',
  /**
   * Beneficios del modal. Adaptados del prototipo: hoy no enviamos la cotización por
   * WhatsApp ni hacemos seguimiento comercial (necesita autorización aparte), así que
   * no se prometen.
   * TODO(producto): agregar los beneficios del Club cuando estén definidos.
   */
  beneficiosModal: [
    'Ves los planes y precios de todos los productos',
    'Contratas y pagas directo en la plataforma, sin intermediarios que manejen tu dinero',
    'Retomas tu contratación cuando quieras, con tu cuenta',
  ],
  bandaPreciosTexto:
    'Registrarte no tiene costo ni te obliga a comprar. Con tu cuenta ves los planes y precios, y contratas cuando quieras.',
  unirseSinContratar: 'Unirme sin contratar todavía',
} as const;

/** Política de datos de la que salen los textos legales */
export const POLITICA_DATOS = {
  version: '2.1',
  fecha: '12 de noviembre de 2026',
  url: 'https://www.grupoigo.com/politica-de-tratamiento-de-datos/',
  responsable: 'GRUPO IGO COLOMBIA S.A.S.',
  nit: '901.383.133-2',
  direccion: 'Cra 19 # 36 – 20, Oficina 511, Edificio Cámara de Comercio, Bucaramanga',
  correo: 'info@grupoigo.com',
  telefono: '323 226 4303',
} as const;

/**
 * Casillas del registro. Empiezan SIN marcar y están separadas (política, sección 4).
 * - `tratamiento` → `acepta_tratamiento_datos` (obligatoria).
 * - `aseguradoras` → `acepta_compartir_aseguradoras` (opcional; finalidad 4 de la sección 5).
 */
export const CASILLAS = {
  tratamiento:
    'Autorizo el tratamiento de mis datos personales para registrarme en el Club SEGURU, cotizar y contratar, según la Política de tratamiento de datos de GRUPO IGO COLOMBIA S.A.S.',
  aseguradoras:
    '(Opcional) Autorizo compartir mis datos con las aseguradoras aliadas para que me envíen cotizaciones y ofertas de sus productos.',
} as const;

/** Contenido del desplegable "Leer la autorización completa y mis derechos" */
export const AUTORIZACION_COMPLETA = {
  titulo: 'Leer la autorización completa y mis derechos',
  responsable: `Responsable: ${POLITICA_DATOS.responsable}, NIT ${POLITICA_DATOS.nit}. ${POLITICA_DATOS.direccion}. Correo: ${POLITICA_DATOS.correo}. Teléfono: ${POLITICA_DATOS.telefono}.`,
  finalidadesTitulo: 'Para qué usamos tus datos',
  finalidades: [
    'Identificarte, registrarte en el Club, cotizar (incluida la tarifa según tu edad), gestionar la contratación y expedición de los productos que pidas, los pagos y la firma electrónica, y atender tus solicitudes.',
    'Cumplir obligaciones legales, contables y de prevención de fraude y lavado de activos, y hacer estadísticas y encuestas de satisfacción.',
    'Si llegaste por un aliado, atribuirle la venta y liquidar su comisión.',
    'Solo si marcas la casilla opcional: compartir tus datos con las aseguradoras aliadas para que te envíen cotizaciones y ofertas.',
  ],
  noCondicion:
    'Recibir ofertas comerciales y compartir tus datos con aseguradoras no es condición para cotizar ni contratar, y puedes revocarlo cuando quieras. No pedimos datos sensibles para cotizar.',
  derechosTitulo: 'Tus derechos',
  derechos: [
    'Conocer, actualizar y rectificar tus datos.',
    'Pedir prueba de la autorización que nos diste.',
    'Saber, si lo pides, qué uso le hemos dado a tus datos.',
    'Revocar la autorización o pedir que eliminemos tus datos, salvo que la ley o un contrato nos obligue a conservarlos.',
    'Pedir que no te contactemos con fines comerciales, por cualquier canal. También puedes responder "BAJA" a nuestros mensajes.',
    'Acceder gratis a tus datos y presentar quejas ante la Superintendencia de Industria y Comercio, después de hacer el trámite con nosotros.',
  ],
  comoEjercer: `Escríbenos a ${POLITICA_DATOS.correo} o llama al ${POLITICA_DATOS.telefono}. Respondemos consultas en máximo 10 días hábiles y reclamos en máximo 15 días hábiles.`,
  enlacePolitica: 'Leer la política completa',
} as const;

export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

/** Preguntas frecuentes comunes: se agregan a las del producto */
export const FAQ_CLUB: PreguntaFrecuente[] = [
  {
    pregunta: '¿De verdad es gratis unirme al Club?',
    respuesta:
      'Sí. Registrarte no tiene costo ni te obliga a comprar. Te da acceso a los planes y a otros beneficios del Club sin costo.',
  },
  {
    pregunta: '¿Qué hacen con mis datos?',
    // TODO(legal): el prototipo decía "escribirte por WhatsApp y correo con información de
    // protección". Eso es contacto comercial (finalidad 2), que según la política y la
    // Ley 2300 de 2023 necesita autorización aparte, y el registro no tiene esa casilla.
    // Este texto describe solo lo que cubren las casillas actuales.
    respuesta:
      'Los usamos para registrarte en el Club, cotizar y gestionar lo que contrates. Solo los compartimos con aseguradoras para enviarte ofertas si tú lo autorizas. Puedes pedir que los actualicemos, los eliminemos o que dejemos de escribirte cuando quieras.',
  },
  {
    pregunta: '¿Qué hago si tengo una duda antes de comprar?',
    respuesta: 'Escríbenos por WhatsApp y el equipo de SEGURU te responde.',
  },
];

/** Claves de localStorage del Club (con prefijo para no chocar con las de la landing) */
export const CLAVES_STORAGE = {
  token: 'club_token',
  nombre: 'club_nombre',
  usuarioId: 'club_usuario_id',
  clienteId: 'club_cliente_id',
  /** Datos no sensibles para prellenar el titular (nunca la contraseña) */
  perfil: 'club_perfil',
  /** URL del plan que se estaba viendo antes de abrir el registro */
  retorno: 'club_retorno_url',
  /** Nombre del aliado que compartió el enlace (lo guarda Layout.astro junto con `aliado_id`) */
  aliadoNombre: 'aliado_nombre',
} as const;

/**
 * Landings por producto (/{slug}/{productoId}): si la API no tiene la landing del producto
 * o falla, se usa el contenido local de `clubProductos.ts` (solo existe para Exequias,
 * Mi Doc Virtual, Familia Protegida y Hogar).
 * TODO(backend): apagar cuando el CRUD de landings esté en producción con los 4 productos cargados.
 */
export const USAR_CONTENIDO_LOCAL_DE_RESPALDO = true;
