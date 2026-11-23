import { ref, watch, type Ref } from 'vue';
import { PlanesService } from '../services/planes.service';

/**
 * Coberturas de los planes públicos de un producto, leídas de la API.
 * La página del Club las usa para la tabla y la calculadora de Familia Protegida.
 * No expone precios: a quien no tiene sesión no se le muestran.
 */

export interface CoberturaClub {
  nombre: string;
  valor: number;
  /** p. ej. "Dólares" */
  unidad: string;
}

export interface PlanCoberturas {
  id: string;
  nombre: string;
  valorAsegurado: number;
  coberturas: CoberturaClub[];
}

const cache = new Map<string, Promise<PlanCoberturas[]>>();

const cargarPlanes = (productoId: string): Promise<PlanCoberturas[]> => {
  if (!cache.has(productoId)) {
    const promesa = PlanesService.obtenerPlanesPorProducto({ producto_id: productoId, estado: true })
      .then(({ data }) =>
        (data as any[])
          // Mismo criterio que PlanesView: solo planes con versión y visibles al público
          .filter((plan) => plan.version && plan.mostrar_publico !== false)
          .map((plan) => ({
            id: plan.id as string,
            nombre: String(plan.version.nombre ?? '').trim(),
            valorAsegurado: Number(plan.version.valor_asegurado) || 0,
            coberturas: ((plan.version.coberturas ?? []) as any[]).map((c) => ({
              nombre: String(c.cobertura?.nombre ?? '').trim(),
              valor: Number(c.valor) || 0,
              unidad: String(c.descripcion ?? '').trim(),
            })),
          }))
          .sort((a, b) => a.valorAsegurado - b.valorAsegurado),
      )
      .catch((error) => {
        cache.delete(productoId);
        throw error;
      });
    cache.set(productoId, promesa);
  }
  return cache.get(productoId)!;
};

export const formatoMillones = (valor: number): string => {
  if (valor >= 1_000_000) {
    const millones = valor / 1_000_000;
    return `$${millones.toLocaleString('es-CO', { maximumFractionDigits: 1 })} M`;
  }
  return `$${Math.round(valor).toLocaleString('es-CO')}`;
};

export const formatoCobertura = (c: CoberturaClub | undefined): string => {
  if (!c) return 'No incluido';
  if (/d[oó]lar/i.test(c.unidad)) return `Hasta USD ${c.valor.toLocaleString('es-CO')}`;
  return formatoMillones(c.valor);
};

/** Tabla "Cobertura × plan" con las coberturas de todos los planes, en el orden en que aparecen */
export const tablaCoberturas = (planes: PlanCoberturas[]) => {
  const nombres: string[] = [];
  for (const plan of planes) {
    for (const c of plan.coberturas) if (c.nombre && !nombres.includes(c.nombre)) nombres.push(c.nombre);
  }
  return {
    columnas: planes.map((p) => p.nombre),
    filas: nombres.map((nombre) => ({
      nombre,
      valores: planes.map((p) => formatoCobertura(p.coberturas.find((c) => c.nombre === nombre))),
    })),
  };
};

export default function useClubCoberturas(productoId: Ref<string | null>) {
  const planes = ref<PlanCoberturas[]>([]);
  const cargando = ref(false);

  watch(
    productoId,
    async (id) => {
      planes.value = [];
      if (!id) return;
      cargando.value = true;
      try {
        const resultado = await cargarPlanes(id);
        if (productoId.value === id) planes.value = resultado;
      } catch {
        // Sin API: la página usa los textos de la configuración y oculta la tabla
      } finally {
        if (productoId.value === id) cargando.value = false;
      }
    },
    { immediate: true },
  );

  return { planes, cargando };
}
