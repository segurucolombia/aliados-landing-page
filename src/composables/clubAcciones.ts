import type { Ref } from 'vue';
import useClubModal from './clubModal';
import useClubSesion from './clubSesion';
import { whatsappUrl } from '../config/club';
import { mensajeContratarWhatsapp, type ProductoClub } from '../config/clubProductos';

/**
 * Qué hacen los botones de la página del Club.
 *
 * - Sin sesión, todos abren el ClubModal (registro completo del backend). Antes de abrirlo
 *   se guarda a dónde volver: `/planes/{productoId}`, para que "Continuar a contratar"
 *   (después de activar la cuenta) o el login dentro del modal lleven a ese producto.
 * - Con sesión, "Contratar" lleva a `/planes/{productoId}`.
 * - Hogar no tiene planes en la plataforma: con sesión, "Contratar" abre WhatsApp (como el
 *   prototipo) y el retorno es la home.
 */
export default function useClubAcciones(producto: Ref<ProductoClub>) {
  const { abrir } = useClubModal();
  const { esMiembro } = useClubSesion();

  const rutaPlanes = (p: ProductoClub) => (p.contratarPorWhatsapp ? '/' : `/planes/${p.productoId}`);

  const ir = (url: string) => {
    window.location.href = url;
  };

  /** "Contratar", "Contratar ahora", "Unirme y contratar", "Elegir este plan" */
  const contratar = () => {
    const p = producto.value;
    if (esMiembro.value) {
      if (p.contratarPorWhatsapp) window.open(whatsappUrl(mensajeContratarWhatsapp(p)), '_blank', 'noopener');
      else ir(rutaPlanes(p));
      return;
    }
    const retorno = rutaPlanes(p);
    abrir({
      pestana: 'unirme',
      intencion: 'contratar',
      retorno,
      alIniciarSesion: p.contratarPorWhatsapp ? undefined : () => ir(retorno),
    });
  };

  /** "Unirme gratis y ver precios": después de entrar se ven los precios en /planes/{id} */
  const verPrecios = () => {
    const p = producto.value;
    if (esMiembro.value) {
      ir(rutaPlanes(p));
      return;
    }
    const retorno = rutaPlanes(p);
    abrir({
      pestana: 'unirme',
      intencion: 'cotizacion',
      retorno,
      alIniciarSesion: p.contratarPorWhatsapp ? undefined : () => ir(retorno),
    });
  };

  /** "Unirme sin contratar todavía" (antes "Solo enviarme la cotización") */
  const unirme = () => {
    abrir({ pestana: 'unirme', intencion: 'cotizacion', retorno: rutaPlanes(producto.value) });
  };

  /** "Ya soy miembro" */
  const entrar = () => {
    abrir({ pestana: 'miembro' });
  };

  return { contratar, verPrecios, unirme, entrar };
}
