/**
 * Contenido de la landing de un producto, tal como lo devuelve la API
 * (`datos_landing` de `GET /api-aliados/productos/find-producto-landing/:producto_id`).
 *
 * Cada bloque corresponde a una sección de la página, en el mismo orden en que se pinta.
 * El campo `titulo` del hero puede traer <em>…</em> para resaltar en naranja: el backend
 * debe guardarlo sanitizado (solo se permite <em>).
 */

export type TipoCalculadoraApi = 'exequias' | 'familia_protegida' | 'hogar';

export interface LandingItemDetalle {
  titulo: string;
  detalle?: string | null;
}

export interface LandingDato {
  valor: string;
  texto: string;
}

export interface LandingPregunta {
  pregunta: string;
  respuesta: string;
}

export interface LandingConfianza {
  icono: string;
  texto: string;
}

export interface LandingProductoApi {
  id: string;
  producto_id: string;
  /** Primer segmento de la URL pública, p. ej. "exequias" */
  slug: string;
  activo: boolean;

  /* Encabezado y hero */
  chip: string;
  kick: string;
  titulo: string;
  subtitulo: string;
  video_url?: string | null;
  video_titulo?: string | null;
  video_subtitulo?: string | null;
  respaldos: string[];

  /* La realidad */
  historia_titulo: string;
  historia: string;
  datos: LandingDato[];

  /* Con plan y sin plan */
  sin_plan: string[];
  con_plan: string[];

  /* Qué recibes */
  incluye_titulo: string;
  incluye: LandingItemDetalle[];
  quien: string;

  /* Es para ti si… */
  para_ti: string[];
  no_para_ti: string[];

  /* Cómo funciona de verdad */
  dia_titulo: string;
  dia: string[];

  /* Dudas comunes */
  objeciones: LandingPregunta[];

  /* ¿Por qué no dejarlo para después? */
  esperar: string;

  /* Por qué confiar */
  confianza: LandingConfianza[];

  /* En 3 pasos */
  pasos: LandingItemDetalle[];

  /* Preguntas frecuentes del producto (se suman las comunes del Club) */
  preguntas: LandingPregunta[];

  /* Comportamiento */
  contratar_por_whatsapp: boolean;
  mensaje_whatsapp?: string | null;
  calculadora?: TipoCalculadoraApi | null;
  mostrar_funerarias: boolean;
  mostrar_tabla_coberturas: boolean;
  montos_desde_planes: boolean;

  /* SEO / vista previa al compartir */
  seo_titulo?: string | null;
  seo_descripcion?: string | null;

  created_at?: string;
  updated_at?: string;
}

/** Producto con su landing: `data` de GET /api-aliados/productos/find-producto-landing/:producto_id */
export interface ProductoLandingApi {
  id: string;
  nombre: string;
  descripcion: string;
  /** url firmada de S3: dura 24 h */
  imagen: { id: string; nombre: string; url: string } | null;
  categoria: { id: string; nombre: string } | null;
  aseguradora: {
    id: string;
    nombre: string;
    estilos: { color_primario: string | null; color_secundario: string | null; logo_url: string | null } | null;
  } | null;
  datos_landing: LandingProductoApi;
}

export interface RespuestaProductoLandingApi {
  success: boolean;
  message: string;
  data: ProductoLandingApi;
}
