import axios from 'axios';
import type { LandingProductoApi, ProductoLandingApi, RespuestaProductoLandingApi } from '../types/landing-producto';
import type { ProductoClub, TipoCalculadora } from '../config/clubProductos';

const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/productos/find-producto-landing';

const CALCULADORAS: Record<string, TipoCalculadora> = {
  exequias: 'eq',
  familia_protegida: 'fp',
  hogar: 'hg',
};

const lista = <T>(v: T[] | null | undefined): T[] => (Array.isArray(v) ? v : []);
const texto = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
/** string[] sin elementos vacíos */
const textos = (v: unknown[] | null | undefined): string[] => lista(v).map(texto).filter(Boolean);
/** Arreglo de objetos sin los que no traen su campo principal */
const items = <T extends object>(v: T[] | null | undefined, principal: keyof T): T[] =>
  lista(v).filter((i) => i && texto(i[principal]));

/** Convierte la respuesta de la API al formato que pintan los componentes de la landing */
export const adaptarLanding = (l: LandingProductoApi): ProductoClub => ({
  clave: l.slug,
  slug: l.slug,
  productoId: l.producto_id,
  contratarPorWhatsapp: !!l.contratar_por_whatsapp,
  mensajeWhatsapp: l.mensaje_whatsapp || undefined,
  calculadora: (l.calculadora && CALCULADORAS[l.calculadora]) || null,
  funerarias: !!l.mostrar_funerarias,
  tablaCoberturas: !!l.mostrar_tabla_coberturas,
  montosDesdePlanes: !!l.montos_desde_planes,
  seoTitulo: l.seo_titulo || undefined,
  seoDescripcion: l.seo_descripcion || undefined,
  chip: l.chip,
  kick: l.kick,
  h1: l.titulo,
  sub: l.subtitulo,
  video: { url: l.video_url || '', titulo: l.video_titulo || '', subtitulo: l.video_subtitulo || '' },
  respaldos: textos(l.respaldos),
  historiaTitulo: l.historia_titulo,
  historia: texto(l.historia),
  datos: items(l.datos, 'valor').map((d) => ({ valor: texto(d.valor), texto: texto(d.texto) })),
  sin: textos(l.sin_plan),
  con: textos(l.con_plan),
  incluyeTitulo: l.incluye_titulo,
  incluye: items(l.incluye, 'titulo').map((i) => ({ titulo: texto(i.titulo), detalle: texto(i.detalle) || undefined })),
  quien: texto(l.quien),
  paraTi: textos(l.para_ti),
  noParaTi: textos(l.no_para_ti),
  diaTitulo: l.dia_titulo,
  dia: textos(l.dia),
  objeciones: items(l.objeciones, 'pregunta'),
  esperar: texto(l.esperar),
  confianza: items(l.confianza, 'texto'),
  pasos: items(l.pasos, 'titulo').map((p) => ({ titulo: texto(p.titulo), detalle: texto(p.detalle) || undefined })),
  preguntas: items(l.preguntas, 'pregunta'),
});

export class LandingProductosService {
  /**
   * Producto con su landing pública (`data.datos_landing`).
   * - null: el producto no tiene landing visible (404: no existe, inactivo, sin landing o landing
   *   desactivada) o el id no es válido (422).
   * - Cualquier otro error (red, 5xx…) se propaga: quien llama decide si usa el respaldo local.
   */
  static async obtenerPorProducto(productoId: string): Promise<ProductoLandingApi | null> {
    try {
      const response = await axios.get<RespuestaProductoLandingApi>(`${baseUrl}/${encodeURIComponent(productoId)}`);
      const data = response.data?.data;
      return data?.datos_landing ? data : null;
    } catch (error: any) {
      const estado = error?.response?.status;
      if (estado === 404 || estado === 422) return null;
      throw error;
    }
  }
}
