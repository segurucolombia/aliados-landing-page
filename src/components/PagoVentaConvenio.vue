<template>
  <div class="pago">
    <h3 class="pago-titulo">Pagar con débito automático</h3>

    <!-- Lo que se va a cobrar, antes de pedir la tarjeta -->
    <div class="desglose">
      <div class="linea">
        <span class="font-semibold">{{ venta.version_producto?.nombre }}</span>
        <span>{{ venta.entidad?.nombre }}</span>
      </div>
      <div class="linea linea-secundaria">
        <span>Correo del pagador</span>
        <span class="break-all">{{ venta.correo || '—' }}</span>
      </div>
      <div class="linea linea-secundaria">
        <span>Vigencia</span>
        <span>{{ formatearFecha(venta.fecha_inicio) }} – {{ formatearFecha(venta.fecha_fin) }}</span>
      </div>

      <div class="separador"></div>

      <div class="linea linea-total">
        <span>Valor a cobrar hoy</span>
        <span class="monto">{{ valorTotal }}</span>
      </div>
      <p class="nota-cobro">
        Se cobrará {{ valorTotal }} hoy y luego cada {{ venta.periodo_meses }}
        {{ venta.periodo_meses === 1 ? 'mes' : 'meses' }} de forma automática a esta tarjeta.
      </p>
    </div>

    <div v-if="error" class="error-banner">
      <p class="font-semibold">{{ error.titulo }}</p>
      <p v-if="error.detalle">{{ error.detalle }}</p>
    </div>

    <!-- Después de 3 verificaciones Mercado Pago aún no confirma el cobro -->
    <div v-if="fase === 'verificacion-pendiente'" class="aviso-proceso">
      <div class="flex-1">
        <p class="font-semibold">Pago en verificación</p>
        <p>
          Mercado Pago aún no confirma el cobro. Se avisará por correo a {{ venta.correo }} cuando se
          confirme; no es necesario pagar de nuevo.
        </p>
      </div>
      <Button
        label="Verificar pago"
        icon="pi pi-refresh"
        class="p-button-primary"
        type="button"
        @click="verificarDeNuevo"
      />
    </div>

    <!-- El formulario de tarjeta de siempre: solo sale el token de un solo uso -->
    <MercadoPagoCardStep
      v-else
      :key="formularioTarjetaKey"
      embebido
      :texto-boton="`Pagar ${valorTotal}`"
      :bloqueado="procesando"
      :initial-doc-type="venta.tipo_documento ?? undefined"
      :initial-doc-number="venta.numero_documento ?? undefined"
      @card-tokenized="pagar"
    />

    <ProcesandoPagoConvenio :visible="procesando" :mensaje="mensajeCarga" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import Button from 'primevue/button';
import MercadoPagoCardStep from './MercadoPagoCardStep.vue';
import ProcesandoPagoConvenio from './ProcesandoPagoConvenio.vue';
import usePagoConvenio from '../composables/pagoConvenio';
import { formatPriceNoDecimal } from '../shared/priceFormat';
import { formatearFechaSinHora as formatearFecha } from '../shared/datesFormat';
import type { VentaConvenioDetalle } from '../services/ventas-convenios.service';

const props = defineProps<{
  venta: VentaConvenioDetalle;
  /** Vuelve a pedir la venta (GET) para reflejar su estado real. null si no se pudo. */
  recargar: () => Promise<VentaConvenioDetalle | null>;
}>();

const emit = defineEmits<{
  /** La venta quedó PAGADA. `paymentId` es null si se supo al recargarla. */
  (e: 'pagada', venta: VentaConvenioDetalle, paymentId: string | null): void;
  (e: 'actualizada', venta: VentaConvenioDetalle): void;
  (e: 'no-encontrada'): void;
  /** Mientras se cobra o se verifica no se deben cambiar los datos del cliente */
  (e: 'update:ocupado', ocupado: boolean): void;
}>();

const { fase, procesando, mensajeCarga, error, formularioTarjetaKey, pagar, verificarDeNuevo } = usePagoConvenio({
  ventaId: () => props.venta.id,
  recargar: () => props.recargar(),
  onPagada: (venta, paymentId) => emit('pagada', venta, paymentId),
  onActualizada: (venta) => emit('actualizada', venta),
  onNoEncontrada: () => emit('no-encontrada'),
});

const valorTotal = computed(() => formatPriceNoDecimal(props.venta.valor_total));

watch(procesando, (ocupado) => emit('update:ocupado', ocupado));
</script>

<style scoped>
.pago {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pago-titulo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

/* Mismo diseño que ResumenVentaConvenio */
.desglose {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
}

.linea {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding: 0.35rem 0;
  font-size: 0.95rem;
  color: #374151;
}

.linea-secundaria {
  color: #6b7280;
  font-size: 0.9rem;
}

.linea-total {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
}

.monto {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.separador {
  border-top: 1px solid #e5e7eb;
  margin: 0.5rem 0;
}

.nota-cobro {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0.5rem 0 0 0;
}

.error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 0.9rem;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  line-height: 1.5;
}

.aviso-proceso {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e3a8a;
  font-size: 0.9rem;
  padding: 1rem 1.25rem;
  border-radius: 10px;
}
</style>
