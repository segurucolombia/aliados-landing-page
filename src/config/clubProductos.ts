/**
 * Contenido de la página del Club SEGURU (visitante sin sesión), por producto.
 *
 * El tono y la estructura salen del prototipo `docs/referencia/club-seguru-artefacto.html`.
 * Los hechos (coberturas, montos, aseguradora, nombres de producto) salen de la landing
 * y de la API: cuando el prototipo no coincidía, se dejó el dato de la landing y se
 * anotó con un comentario `Landing:`.
 *
 * Los precios NO se muestran a quien no tiene sesión: la sección "Cuánto cuesta" muestra
 * el bloqueo "Precios solo para miembros". Por eso aquí no hay ningún precio.
 *
 * Todo lo marcado con `sinValidar` (cifras sin fuente) solo se muestra si
 * `MOSTRAR_DATOS_SIN_VALIDAR` está encendido en `src/config/club.ts`.
 */

export type ClaveProducto = 'eq' | 'md' | 'fp' | 'hg';

export const CLAVES_PRODUCTO: ClaveProducto[] = ['eq', 'md', 'fp', 'hg'];

export interface ItemConDetalle {
  titulo: string;
  detalle?: string;
}

export interface Dato {
  valor: string;
  texto: string;
  /** Cifra sin fuente: solo con MOSTRAR_DATOS_SIN_VALIDAR */
  sinValidar?: boolean;
}

export interface Pregunta {
  pregunta: string;
  respuesta: string;
}

/** Calculadora que se muestra en la landing (null: ninguna) */
export type TipoCalculadora = 'eq' | 'fp' | 'hg';

export interface ProductoClub {
  /** Clave de la pestaña en la home. En las landings que vienen de la API es el slug. */
  clave: ClaveProducto | string;
  /** Primer segmento de la ruta pública: /{slug}/{productoId} */
  slug: string;
  /** Calculadora de la landing: 'eq' Exequias, 'fp' Familia Protegida, 'hg' Hogar; null = ninguna */
  calculadora: TipoCalculadora | null;
  /** Muestra el buscador de funerarias aliadas */
  funerarias: boolean;
  /** Muestra la tabla "Qué cubre cada plan" con las coberturas reales de la API */
  tablaCoberturas: boolean;
  /** Reemplaza el primer dato y el detalle de los 2 primeros "incluye" con los montos reales de los planes */
  montosDesdePlanes: boolean;
  /** Título de la pestaña y de la vista previa al compartir el enlace */
  seoTitulo?: string;
  /** Descripción para buscadores y vista previa al compartir el enlace */
  seoDescripcion?: string;
  /** Mensaje prellenado del botón de WhatsApp */
  mensajeWhatsapp?: string;
  /** Producto real de la API (`/planes/{productoId}`) */
  productoId: string;
  /**
   * El producto no tiene planes que se puedan contratar en la plataforma: "Contratar"
   * lleva a WhatsApp (igual que el prototipo).
   */
  contratarPorWhatsapp?: boolean;
  chip: string;
  kick: string;
  /** Puede llevar <em> para el color de acento. Texto fijo, no viene del usuario. */
  h1: string;
  /** h1 con cifra sin fuente; reemplaza a `h1` solo con MOSTRAR_DATOS_SIN_VALIDAR */
  h1SinValidar?: string;
  sub: string;
  video: { url: string; titulo: string; subtitulo: string };
  respaldos: string[];
  historiaTitulo: string;
  historia: string;
  datos: Dato[];
  sin: string[];
  con: string[];
  incluyeTitulo: string;
  incluye: ItemConDetalle[];
  quien: string;
  paraTi: string[];
  noParaTi: string[];
  diaTitulo: string;
  dia: string[];
  objeciones: Pregunta[];
  esperar: string;
  confianza: { icono: string; texto: string }[];
  pasos: ItemConDetalle[];
  preguntas: Pregunta[];
}

/** Paso 1 común. Landing: el registro real pide más que "nombre, correo y WhatsApp". */
const PASO_UNIRME: ItemConDetalle = {
  titulo: 'Únete al Club',
  detalle: 'Gratis, con tus datos y tu documento. Activas la cuenta desde tu correo.',
};

const PAGO_DIRECTO = {
  icono: '🔒',
  texto: 'Pagas directo en la plataforma de SEGURU. Nunca le pagas a la persona que te compartió esta página.',
};

export const PRODUCTOS_CLUB: Record<ClaveProducto, ProductoClub> = {
  eq: {
    clave: 'eq',
    slug: 'exequias',
    calculadora: 'eq',
    funerarias: true,
    tablaCoberturas: false,
    montosDesdePlanes: false,
    productoId: 'c76bcc7f-c3a1-4e39-b0c8-0e2f4e1e7d22',
    chip: 'Exequias',
    // Landing: el producto se llama "Exequias SEGURU" (prototipo: "Exequias SEGURU Familiar")
    kick: 'Exequias SEGURU',
    h1: 'Cuando llegue el momento, que tu familia <em>solo tenga que hacer una llamada</em>.',
    h1SinValidar: 'Un servicio exequial puede costar <em>más de $8 millones</em>. ¿Tu familia los tiene hoy?',
    sub: 'Con un solo plan, el servicio exequial del titular y de hasta 8 beneficiarios queda resuelto, con cobertura en todo el país.',
    video: { url: '', titulo: 'Míralo en 4 minutos', subtitulo: 'Por qué dejarlo resuelto hoy' },
    // Landing: la API solo registra a Pan American Life como aseguradora (el prototipo sumaba "Respaldo de PREVER")
    respaldos: ['Pan American Life', 'Vigilada por la Superintendencia Financiera', 'Pago directo en la plataforma'],
    historiaTitulo: 'El peor momento para improvisar',
    historia: 'Nadie planea ese día. Pero cuando llega, hay que decidir, pagar y moverse rápido.',
    datos: [
      { valor: '+$8 millones', texto: 'Lo que puede costar un servicio exequial en Colombia', sinValidar: true },
      { valor: 'Pocas horas', texto: 'Es el tiempo que tiene la familia para decidir y pagar' },
      { valor: '1 llamada', texto: 'Es lo que hace tu familia cuando tienes el plan' },
    ],
    sin: [
      'Llamar a familiares para pedir prestado',
      'Decidir servicios y valores bajo presión',
      'Endeudarse o vender algo en pleno duelo',
    ],
    con: [
      'Una llamada a la línea de atención',
      'El servicio queda resuelto, con cobertura nacional',
      'Tu familia se dedica a acompañarse',
    ],
    incluyeTitulo: 'Qué queda resuelto',
    // Landing: coberturas de los planes públicos de Exequias en la API
    incluye: [
      { titulo: 'Sala de velación y cofre fúnebre' },
      { titulo: 'Traslado nacional del cuerpo' },
      { titulo: 'Gestión de documentos legales' },
      { titulo: 'Servicio religioso y transporte de acompañantes' },
      { titulo: 'Destino final y post destino final', detalle: 'Bóveda, parque cementerio o cremación' },
      {
        titulo: 'Apoyo económico para el titular',
        detalle: 'Hasta $15 millones por muerte o invalidez accidental y $1 millón por muerte natural, según las condiciones del plan',
      },
    ],
    quien:
      'El titular puede tener hasta 65 años y los beneficiarios hasta 75 años sin costo adicional: padres, hijos, abuelos, hermanos, cónyuge o compañero(a) permanente, entre otros parentescos. Un solo plan para hasta 9 personas.',
    paraTi: [
      'Quieres que tu familia no tenga que conseguir el dinero en cuestión de horas',
      'Quieres cubrir en un solo plan a padres, hijos, abuelos u otros familiares',
      'Eres titular de hasta 65 años',
    ],
    noParaTi: [
      'Ya tienes un servicio exequial que cubre a todo tu grupo familiar: compáralo antes de contratar',
      'Buscas dejar dinero a tu familia: mira Familia Protegida',
    ],
    diaTitulo: 'El día que lo necesites',
    dia: [
      'Tu familia llama a la línea de atención: 018000-180533 o (604) 6040232',
      'Se coordinan los servicios incluidos en tu plan',
      'Velación, traslado y destino final quedan resueltos',
    ],
    objeciones: [
      {
        pregunta: '“Todavía es pronto”',
        respuesta:
          'Nadie elige cuándo lo va a necesitar. Los tiempos de espera empiezan a contar desde que contratas: muerte accidental desde el segundo día y natural desde los 35 días. Por eso conviene tenerlo antes de necesitarlo.',
      },
      {
        pregunta: '“Tengo ahorros”',
        respuesta:
          'Puede que alcancen, pero el servicio se paga en cuestión de horas y esos ahorros suelen estar pensados para otras cosas. El plan evita tener que tocarlos en ese momento.',
      },
      {
        pregunta: '“Mi familia es grande”',
        respuesta:
          'Un solo plan incluye al titular y hasta 8 beneficiarios: padres, hijos, abuelos, hermanos, cónyuge o compañero(a) permanente, entre otros.',
      },
      { pregunta: '“Vivimos en ciudades distintas”', respuesta: 'La cobertura es nacional e incluye el traslado nacional del cuerpo.' },
      {
        pregunta: '“No quiero hablar de esto”',
        respuesta: 'Es normal. Por eso conviene resolverlo hoy, con calma, y no que tu familia tenga que hacerlo en el peor momento.',
      },
    ],
    esperar:
      'Los tiempos de espera empiezan a contar desde el día que contratas: muerte accidental desde el segundo día, natural desde los 35 días. Cada día sin plan es un día sin cobertura.',
    confianza: [
      // Landing: aseguradora registrada en la API para Exequias (se quitó PREVER)
      { icono: '🛡️', texto: 'Respaldado por Pan American Life Compañía de Seguros de Colombia, vigilada por la Superintendencia Financiera.' },
      { icono: '📞', texto: 'Cuando llegue el momento, tu familia solo llama: 018000-180533 o (604) 6040232.' },
      PAGO_DIRECTO,
    ],
    pasos: [
      PASO_UNIRME,
      { titulo: 'Mira los precios', detalle: 'Eliges mensual o anual, según lo que te quede cómodo.' },
      // Landing: medios de pago del wizard ("Débito automático" u "Otros medios de pago")
      { titulo: 'Registra a tu familia y paga', detalle: 'Directo en la plataforma, con débito automático u otros medios de pago.' },
    ],
    preguntas: [
      {
        pregunta: '¿Qué incluye el servicio exequial?',
        respuesta:
          'Sala de velación, cofre fúnebre, traslado nacional, gestión de documentos legales, servicio religioso, transporte de acompañantes, destino final (bóveda, parque cementerio o cremación) y post destino final. También un apoyo económico para el titular. El detalle completo está en la ficha del plan.',
      },
      {
        pregunta: '¿Quiénes pueden estar en el plan?',
        respuesta:
          'El titular (hasta 65 años) y hasta 8 beneficiarios (hasta 75 años sin costo adicional) del grupo familiar: padres, hijos, abuelos, hermanos, nietos, tíos, sobrinos, cónyuge o compañero(a) permanente, padrastros, madrastras, hijastros(as) y hermanastros(as). Las personas mayores de 75 años o que no son familiares tienen un valor adicional.',
      },
      {
        pregunta: '¿Desde cuándo empieza a cubrir?',
        respuesta:
          'Muerte accidental o violenta, desde el segundo día de vigencia; muerte natural, desde los 35 días; enfermedades graves preexistentes, desde los 121 días. Por eso conviene no dejarlo para después: los tiempos empiezan a contar desde que contratas.',
      },
      { pregunta: '¿Sirve en todo el país?', respuesta: 'Sí. La cobertura es nacional y hay funerarias aliadas en varias ciudades.' },
    ],
  },

  md: {
    clave: 'md',
    slug: 'mi-doc-virtual',
    calculadora: null,
    funerarias: false,
    tablaCoberturas: false,
    montosDesdePlanes: false,
    productoId: '5f10c4e5-9d08-469c-a5e3-86401d476b9d',
    chip: 'Mi Doc Virtual',
    // Landing: el producto se llama "Mi Doc Virtual +"
    kick: 'Mi Doc Virtual +',
    h1: 'Tu médico en el celular, <em>sin esperar la cita</em> de la EPS.',
    // Landing: la API dice que el médico en línea es 24/7
    sub: 'Consultas por videollamada con médico general, pediatra y psicólogo, las 24 horas, sin filas y sin traslados.',
    video: { url: '', titulo: 'Míralo en 80 segundos', subtitulo: 'Cómo funciona Mi Doc Virtual' },
    respaldos: ['Respaldo de Pan American Life', 'Vigilada por la Superintendencia Financiera', 'Pago directo en la plataforma'],
    historiaTitulo: 'Una consulta sencilla no debería costarte una mañana',
    historia:
      'Una duda con tu hijo, un malestar que no es urgencia, una semana difícil. Casi siempre lo que falta no es una cirugía: es que alguien te escuche pronto.',
    datos: [
      { valor: 'Días o semanas', texto: 'Lo que muchas personas esperan por una cita con su EPS', sinValidar: true },
      { valor: 'Cero filas', texto: 'Te conectas desde donde estés' },
      { valor: '3 profesionales', texto: 'Médico general, pediatra y psicólogo' },
    ],
    sin: [
      'Pedir la cita y esperar a que haya agenda',
      'Faltar al trabajo y pagar transporte por una consulta corta',
      'Dejar pasar el malestar porque no alcanza el tiempo',
    ],
    con: [
      'Te conectas desde el celular, cuando lo necesites',
      'Médico general, pediatra o psicólogo por videollamada',
      'Sin filas, sin traslados y con descuentos en especialistas',
    ],
    incluyeTitulo: 'Lo que recibes',
    // Landing: coberturas de los planes de Mi Doc Virtual + en la API (el prototipo tenía una lista más corta)
    incluye: [
      { titulo: 'Médico general, pediatra y psicólogo por videollamada', detalle: 'Hasta 5 consultas al mes, con la app e-doctor' },
      { titulo: 'Descuentos en citas con especialistas' },
      { titulo: 'Orientación nutricional por teléfono' },
      { titulo: 'Médico a domicilio y traslado médico terrestre', detalle: 'Una vez al año cada uno, según las condiciones del plan' },
      { titulo: 'Urgencia odontológica y limpieza dental', detalle: 'Una vez al año cada una, según las condiciones del plan' },
      {
        titulo: 'Protección económica',
        detalle: 'Hasta $15 millones por muerte o invalidez accidental y $1 millón por muerte natural, según las condiciones del plan',
      },
    ],
    quien:
      'El plan y el precio son por persona: cada quien que quiera tener su médico en el celular necesita su propio plan. Es un complemento a tu EPS, no la reemplaza ni sustituye las urgencias.',
    paraTi: [
      'Quieres consultas rápidas para ti, sin filas ni traslados',
      'Quieres hablar con un psicólogo o pediatra sin salir de casa',
      'Quieres un complemento a tu EPS',
    ],
    noParaTi: [
      'Buscas reemplazar tu EPS o la atención de urgencias: este plan no las reemplaza',
      'Quieres cubrir a toda la familia con un solo plan: el plan es por persona',
    ],
    diaTitulo: 'Cómo es una consulta',
    dia: ['Descargas la app e-doctor (App Store o Google Play)', 'Eliges tu doctor', 'Te conectas por videollamada'],
    objeciones: [
      {
        pregunta: '“Ya tengo EPS”',
        respuesta:
          'Este plan no la reemplaza: es un complemento para consultas rápidas, sin filas ni traslados. Para tratamientos y urgencias sigues usando tu EPS.',
      },
      {
        pregunta: '“No sé usar aplicaciones”',
        respuesta: 'Las citas se piden con la app e-doctor. Los demás servicios se atienden por línea telefónica: (601) 7422624 o 01 8000 181245.',
      },
      // La calculadora de Mi Doc Virtual es de precios y no se muestra sin sesión
      { pregunta: '“Somos varios en casa”', respuesta: 'El plan es por persona, así que cada quien lo activa si lo necesita.' },
      {
        pregunta: '“¿Y si es una urgencia?”',
        respuesta: 'Las urgencias no se atienden por este plan: en esos casos usa el servicio de salud que ya tienes.',
      },
    ],
    esperar:
      'El plan es por persona, así que cada quien puede activarlo cuando lo necesite. Mientras más pronto lo tengas, antes cuentas con tu médico en el celular.',
    confianza: [
      { icono: '🛡️', texto: 'Respaldado por Pan American Life Compañía de Seguros de Colombia, vigilada por la Superintendencia Financiera.' },
      {
        icono: '📱',
        texto: 'Las citas se piden con la app e-doctor (App Store o Google Play). Para otros servicios: (601) 7422624 o 01 8000 181245.',
      },
      PAGO_DIRECTO,
    ],
    pasos: [
      PASO_UNIRME,
      { titulo: 'Mira los precios', detalle: 'Plan semestral o anual. El valor es por persona.' },
      { titulo: 'Paga y descarga e-doctor', detalle: 'Eliges tu doctor y te conectas.' },
    ],
    preguntas: [
      {
        pregunta: '¿Reemplaza mi EPS?',
        respuesta:
          'No. Es un complemento para consultas rápidas, sin filas ni traslados. Para tratamientos y urgencias se sigue usando el servicio de salud que ya tienes.',
      },
      {
        pregunta: '¿Cómo pido una cita?',
        respuesta: 'Descargas la app e-doctor desde App Store (iPhone) o Google Play Store (Android), eliges tu doctor y te conectas.',
      },
      {
        pregunta: '¿Cuántas consultas incluye?',
        respuesta: 'Hasta 5 consultas de telemedicina al mes con médico general, pediatra o psicólogo. El detalle está en la ficha del plan.',
      },
      {
        pregunta: '¿Cubre a toda la familia?',
        respuesta: 'No. El plan y el precio son por persona. Si quieres que varios familiares lo tengan, cada uno necesita su propio plan.',
      },
    ],
  },

  fp: {
    clave: 'fp',
    slug: 'familia-protegida',
    calculadora: 'fp',
    funerarias: false,
    tablaCoberturas: true,
    montosDesdePlanes: true,
    productoId: '03b524ee-a3e0-4c39-a1ea-88e16df0c18c',
    chip: 'Familia Protegida',
    kick: 'Familia Protegida SEGURU',
    h1: 'Los gastos del hogar no se detienen cuando <em>los ingresos sí</em>.',
    sub: 'Un respaldo económico para el hogar si llega a faltar o quedar en invalidez quien lo sostiene. Un solo plan protege a los 2 padres y hasta 3 hijos.',
    video: { url: '', titulo: 'Míralo en 85 segundos', subtitulo: 'Cómo funciona Familia Protegida' },
    respaldos: ['Respaldo de Positiva Compañía de Seguros', 'Pago directo en la plataforma'],
    historiaTitulo: 'Lo que más duele no debería ser también lo que más endeuda',
    historia:
      'Si falta o queda en invalidez quien sostiene el hogar, la vida sigue pidiendo lo mismo: casa, comida, colegio. Este plan le da a tu familia tiempo y un respaldo para reorganizarse.',
    // El primer dato ("$50 a $70 millones") se reemplaza con los montos reales de la API al cargar
    datos: [
      { valor: '$50 a $70 millones', texto: 'Respaldo por fallecimiento o invalidez del titular, según el plan' },
      { valor: '2 padres + 3 hijos', texto: 'Un solo plan protege a la familia' },
      { valor: 'Cada mes', texto: 'Llegan el arriendo, el colegio y las cuentas, haya o no ingresos' },
    ],
    sin: [
      'El ingreso principal se detiene, los gastos siguen',
      'El arriendo, el colegio y las deudas no esperan',
      'La familia decide con angustia, no con calma',
    ],
    con: [
      'Un respaldo económico para seguir adelante',
      'Tiempo para reorganizar la vida del hogar',
      'Los hijos también quedan respaldados ante accidentes y enfermedades graves amparadas, según el plan',
    ],
    incluyeTitulo: 'Qué respalda el plan',
    incluye: [
      { titulo: 'Respaldo por fallecimiento del titular', detalle: 'Desde $50 hasta $70 millones, según el plan' },
      { titulo: 'Respaldo por invalidez del titular', detalle: 'Desde $50 hasta $70 millones, según el plan' },
      { titulo: 'Enfermedades graves amparadas de los hijos', detalle: 'Según el plan' },
      { titulo: 'Invalidez accidental de los hijos', detalle: 'Según el plan' },
      { titulo: 'Gastos médicos por accidente de los hijos', detalle: 'Según el plan' },
    ],
    quien: 'Un solo plan protege a los 2 padres y hasta 3 hijos.',
    paraTi: [
      'Eres quien sostiene económicamente el hogar',
      'Tienes hijos y quieres respaldo ante accidentes y enfermedades graves amparadas',
      'Quieres proteger a los 2 padres y hasta 3 hijos con un solo plan',
    ],
    noParaTi: [
      'Buscas atención médica: este plan es un respaldo económico, no un servicio de salud',
      'Buscas cubrir solo gastos funerarios: mira Exequias',
    ],
    diaTitulo: 'Si llega a ocurrir',
    dia: [
      'Tu familia llama a la línea de atención: +57 315 460 3134',
      'SEGURU hace el trámite con la aseguradora',
      'La familia recibe el respaldo del plan elegido, según las condiciones',
    ],
    objeciones: [
      {
        pregunta: '“Mi familia está bien por ahora”',
        respuesta: 'El respaldo existe justo para cuando eso cambia de repente. Mira en la calculadora cuántos meses de gastos cubriría.',
      },
      {
        // Sin precios para visitantes (el prototipo decía "cuesta poco más de $1.000 al día")
        pregunta: '“Es mucho dinero”',
        respuesta:
          'Únete gratis al Club y mira el valor de cada plan antes de decidir. Un solo plan protege a los 2 padres y hasta 3 hijos.',
      },
      {
        pregunta: '“No quiero pensar en eso”',
        respuesta:
          'Es difícil, y por eso mismo conviene pensarlo hoy con calma: así tu familia no tiene que resolverlo mañana bajo presión.',
      },
      {
        pregunta: '“¿Qué pasa con mis hijos?”',
        respuesta:
          'Los hijos tienen respaldo ante enfermedades graves amparadas, invalidez accidental y gastos médicos por accidente, según el plan.',
      },
    ],
    esperar: 'Los períodos de espera y exclusiones están en la ficha del producto. Cuanto antes contrates, antes empiezan a contar.',
    confianza: [
      { icono: '🛡️', texto: 'Cuenta con el respaldo de Positiva Compañía de Seguros.' },
      {
        icono: '📞',
        texto: 'Si ocurre un siniestro, el trámite lo hacemos desde SEGURU a través de nuestra línea de atención: +57 315 460 3134.',
      },
      PAGO_DIRECTO,
    ],
    pasos: [
      PASO_UNIRME,
      { titulo: 'Compara los 3 planes', detalle: 'Esencial, Plus o Superior, según el respaldo que quieras.' },
      { titulo: 'Registra a tu familia y paga', detalle: 'Los 2 padres y hasta 3 hijos, directo en la plataforma.' },
    ],
    preguntas: [
      {
        pregunta: '¿Qué es Familia Protegida?',
        respuesta:
          'Un respaldo económico: si el padre o la madre asegurado fallece o queda en invalidez, la familia recibe el valor del plan elegido. También respalda a los hijos en los casos que indica cada plan.',
      },
      { pregunta: '¿Quiénes quedan protegidos?', respuesta: 'Los 2 padres y hasta 3 hijos.' },
      {
        pregunta: '¿Qué enfermedades de los hijos están amparadas?',
        respuesta: 'Cáncer, leucemia, insuficiencia renal crónica, accidente cerebrovascular y SIDA, según las condiciones del plan.',
      },
    ],
  },

  hg: {
    clave: 'hg',
    slug: 'hogar',
    calculadora: 'hg',
    funerarias: false,
    tablaCoberturas: false,
    montosDesdePlanes: false,
    // Landing: el producto existe en la API como "Vivienda Segura", pero no tiene planes activos
    productoId: '04a56df9-7efb-443a-9b25-02da4830b43d',
    contratarPorWhatsapp: true,
    chip: 'Hogar',
    // Landing: el producto se llama "Vivienda Segura" (prototipo: "Seguro de Hogar SEGURU")
    kick: 'Vivienda Segura',
    h1: 'Un incendio. Un temblor. <em>¿Quién paga?</em>',
    sub: 'Protege tu casa y todo lo que hay dentro. Si pasa algo, responde tu aseguradora y no tus ahorros.',
    video: { url: '', titulo: 'Míralo en 90 segundos', subtitulo: 'Por qué proteger tu casa' },
    respaldos: ['Respaldo de MAPFRE', 'Vigilada por la Superintendencia Financiera', 'Pago directo en la plataforma'],
    historiaTitulo: 'Lo que te tomó años construir puede perderse en minutos',
    historia:
      'Llegas a casa y hay humo, o sientes que el piso se mueve y, cuando termina, hay grietas en la pared. Miras alrededor: la cama, la nevera, el televisor, los recuerdos. Y aparece la única pregunta que importa: ¿con qué vas a pagarlo?',
    datos: [
      {
        valor: '≈ 17 al día',
        texto: 'Incendios estructurales estimados en Colombia; 7 de cada 10 ocurren en viviendas (ANRACI, 2026)',
      },
      { valor: '≈ 80 al día', texto: 'Sismos que registra el Servicio Geológico Colombiano; casi todos pasan inadvertidos' },
      { valor: '1 llamada', texto: 'MAPFRE atiende los siniestros las 24 horas' },
    ],
    sin: [
      'Pagas tú la reparación y la reposición',
      'Respondes también si un vecino resulta perjudicado',
      'Usas tus ahorros, te endeudas o pierdes lo que no puedes reponer',
    ],
    con: [
      'Llamas a MAPFRE, línea de atención 24 horas',
      'La aseguradora responde por el daño cubierto',
      'Tú te concentras en tu familia, no en la factura',
    ],
    incluyeTitulo: 'Qué protege tu seguro',
    incluye: [
      { titulo: 'Incendio, rayo y explosión', detalle: 'Dentro o fuera de tu inmueble' },
      {
        titulo: 'Daños por agua e inundación',
        detalle: 'Tuberías rotas, llaves abiertas, colectores obstruidos y crecientes de ríos y quebradas',
      },
      { titulo: 'Temblor, terremoto y erupción volcánica', detalle: 'Deducible: 2 % del valor asegurable, mínimo 2 SMMLV' },
      { titulo: 'Vendaval, granizo, humo, impacto de vehículos y caída de aeronaves' },
      { titulo: 'Rotura de vidrios' },
      { titulo: 'Actos mal intencionados de terceros, incluido terrorismo', detalle: 'Deducible: 10 % de la pérdida, mínimo 1 SMMLV' },
      {
        titulo: 'Responsabilidad civil familiar',
        detalle: 'Hasta $50 millones si tú, tu familia o tu mascota perjudican a un tercero. Deducible: 10 %, mínimo 1 SMMLV',
      },
      { titulo: 'Gastos que nadie considera', detalle: 'Remoción de escombros, honorarios para reponer lo afectado y reposición de escrituras' },
    ],
    quien:
      'Aseguras la casa o apartamento y los contenidos de uso doméstico (muebles, electrodomésticos y enseres). Sin infraseguro: si el daño es menor a la suma asegurada, te responden por el daño real. Los daños materiales (incendio, agua, vendaval) no tienen deducible. Este seguro no incluye hurto ni robo.',
    paraTi: [
      'Eres dueño o dueña de tu vivienda y de lo que hay dentro',
      'Quieres que un incendio, un temblor o una inundación no se lleve tus ahorros',
      'Quieres proteger también tu responsabilidad si un tercero resulta perjudicado',
    ],
    noParaTi: [
      'Buscas cobertura contra hurto o robo: este seguro no la incluye',
      'Tu vivienda es de estrato 1 o 2, está en zona rural o tiene un negocio adentro: no es asegurable',
      'Es una finca o casa de campo',
    ],
    diaTitulo: 'Si llega a ocurrir',
    dia: [
      'Llamas a MAPFRE: 018000 519 991 o 307 7024 (Bogotá), las 24 horas',
      'Avisas dentro de los 3 días hábiles y formalizas el reclamo con una carta, la relación valorizada de bienes y facturas o cotizaciones',
      'La aseguradora atiende el siniestro según los amparos y deducibles de tu póliza',
    ],
    objeciones: [
      {
        pregunta: '“A mí no me va a pasar”',
        respuesta:
          'Colombia registra cerca de 17 incendios estructurales al día (estimación de ANRACI) y es zona sísmica. La pregunta no es si es probable, sino quién paga si ocurre.',
      },
      {
        // Sin precios para visitantes (el prototipo decía "cuesta cerca de $533 al día")
        pregunta: '“Es muy caro”',
        respuesta:
          'Escríbenos y te contamos el valor de cada plan. El plan más sencillo ya protege hasta $115 millones en daños, además de $50 millones de responsabilidad civil.',
      },
      {
        pregunta: '“Ya tengo seguro en mi edificio”',
        respuesta:
          'El seguro de la copropiedad normalmente cubre las zonas comunes, no lo que hay dentro de tu vivienda. Revisa tu póliza.',
      },
      {
        pregunta: '“¿Y si me roban?”',
        respuesta:
          'Este seguro no cubre hurto ni robo. Cubre incendio, agua, temblor, vendaval, vidrios, actos de terceros y responsabilidad civil.',
      },
      {
        pregunta: '“No sé qué plan elegir”',
        respuesta:
          'Usa la calculadora: suma lo que costaría reponer lo que tienes adentro y reconstruir tu vivienda, y te mostramos el plan que alcanza.',
      },
    ],
    esperar:
      'El seguro se compra antes del evento y solo cubre lo que ocurre durante la vigencia de la póliza. Las condiciones y exclusiones están en la ficha del producto.',
    confianza: [
      { icono: '🛡️', texto: 'Respaldado por MAPFRE Seguros Generales S.A., vigilada por la Superintendencia Financiera.' },
      {
        icono: '📞',
        texto: 'Si pasa algo, llama a MAPFRE las 24 horas: 018000 519 991 (nacional) o 307 7024 (Bogotá). Tienes 3 días hábiles para avisar.',
      },
      PAGO_DIRECTO,
    ],
    pasos: [
      PASO_UNIRME,
      { titulo: 'Elige tu plan', detalle: 'Cuatro planes, según lo que costaría reconstruir y amoblar tu vivienda.' },
      {
        titulo: 'Completa la solicitud y paga',
        detalle: 'Con tu cédula y el formulario de conocimiento del cliente. La prima se paga una vez al año.',
      },
    ],
    preguntas: [
      {
        pregunta: '¿Qué cubre el seguro de hogar?',
        respuesta:
          'Incendio, rayo y explosión; daños por agua e inundación; temblor, terremoto y erupción volcánica; vendaval, granizo, humo, impacto de vehículos y caída de aeronaves; rotura de vidrios; actos mal intencionados de terceros; y responsabilidad civil familiar. También gastos como remoción de escombros, honorarios y reposición de escrituras.',
      },
      {
        pregunta: '¿Qué no cubre?',
        respuesta:
          'Hurto y robo. Tampoco lucro cesante, desgaste o humedad por el uso, daños por obras o reparaciones, defectos previos, dolo o culpa grave, enfermedades transmisibles ni computadores de más de 5 años. La lista completa está en el condicionado de la póliza.',
      },
      {
        pregunta: '¿Qué viviendas se pueden asegurar?',
        respuesta:
          'Viviendas urbanas, de estrato 3 o superior, en construcción de concreto o ladrillo, sin comercio o industria en el inmueble. No se aseguran fincas ni casas de campo, viviendas en despoblado, construcciones en adobe, madera, guadua o bahareque, ni contenidos que pertenezcan a una empresa. En San Andrés y Providencia, Chocó, La Guajira, Arauca, Casanare, Putumayo y zonas de difícil acceso se requiere autorización previa de la aseguradora.',
      },
      {
        pregunta: '¿Cuánto debo asumir en un siniestro?',
        respuesta:
          'Daños materiales (incendio, agua, vendaval, vidrios): sin deducible. Terremoto: 2 % del valor asegurable, mínimo 2 SMMLV. Actos mal intencionados de terceros y responsabilidad civil: 10 % de la pérdida, mínimo 1 SMMLV.',
      },
      {
        pregunta: '¿Qué significa «sin infraseguro»?',
        respuesta:
          'Que si el daño es menor a la suma asegurada, te responden por el daño real hasta el límite, sin recortar la indemnización porque tu vivienda valga más.',
      },
      {
        pregunta: '¿Qué hago si pasa algo?',
        respuesta:
          'Llama de inmediato a MAPFRE: 018000 519 991 o 307 7024 (Bogotá), las 24 horas. Tienes 3 días hábiles para avisar y luego formalizas el reclamo por escrito con la relación valorizada de bienes y facturas o cotizaciones.',
      },
    ],
  },
};

/**
 * Límites de los 4 planes de Hogar para la calculadora (sin precios).
 * Vienen del prototipo (cotización de MAPFRE): la API todavía no tiene planes de
 * Vivienda Segura. Reemplazar por los planes reales cuando existan.
 */
export const PLANES_HOGAR = [
  { nombre: 'Plan 1', vivienda: 100_000_000, contenidos: 15_000_000 },
  { nombre: 'Plan 2', vivienda: 200_000_000, contenidos: 30_000_000 },
  { nombre: 'Plan 3', vivienda: 300_000_000, contenidos: 45_000_000 },
  { nombre: 'Plan 4', vivienda: 400_000_000, contenidos: 60_000_000 },
];

/** Costo de referencia de un servicio exequial. Sin fuente: solo con MOSTRAR_DATOS_SIN_VALIDAR. */
export const COSTO_EXEQUIAL_SIN_VALIDAR = 8_000_000;

/** "Sin letra pequeña escondida" (común a todos los productos) */
export const VERIFICABLE = [
  'Antes de contratar puedes revisar la ficha con coberturas, períodos de espera y exclusiones',
  'Solo pagas en la plataforma de SEGURU, nunca a la persona que te compartió la página',
  'Tienes una línea de atención para dudas antes y después de contratar',
];

/**
 * Landing: FAQ.vue dice "SEGURU es una marca registrada de AIB SEGUROS - AMÉRICA INSURANCE
 * BROKER LTDA." (el prototipo decía "marca de Grupo IGO Colombia, con el respaldo de AIB SEGUROS").
 */
export const MARCA_SEGURU = 'SEGURU es una marca registrada de AIB SEGUROS – AMÉRICA INSURANCE BROKER LTDA.';

export const TEXTO_LEGAL = `${MARCA_SEGURU} Las coberturas, condiciones, períodos de espera y exclusiones de cada plan están en la ficha del producto, que puedes revisar antes de contratar. Los valores corresponden a la fecha de publicación y pueden cambiar.`;

export const mensajeWhatsapp = (p: ProductoClub): string => p.mensajeWhatsapp || `Hola, vi la página de ${p.kick} y tengo una duda.`;

export const mensajeContratarWhatsapp = (p: ProductoClub): string => `Hola, quiero contratar ${p.kick} de SEGURU.`;

/** Contenido local de un producto (respaldo mientras la API no tenga su landing) */
export const productoClubPorId = (productoId: string): ProductoClub | null =>
  Object.values(PRODUCTOS_CLUB).find((p) => p.productoId === productoId) ?? null;

/**
 * Slug para la URL del producto (/{slug}/{productoId}): minúsculas, sin tildes ni ñ, palabras
 * unidas con guiones. "Familia Protegida SEGURU" → "familia-protegida-seguru".
 */
export const slugDeTexto = (texto: string | null | undefined): string =>
  (texto || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'producto';
