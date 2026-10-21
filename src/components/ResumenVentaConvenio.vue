<template>
  <!-- Mismo diseño que "Detalle de tu compra" (DesgloseCotizacion) del flujo normal -->
  <div class="desglose">
    <h3 class="desglose-titulo">Detalle de tu compra</h3>

    <div class="linea">
      <span class="font-semibold">{{ venta.version_producto?.nombre }}</span>
      <span class="monto">{{ formatPriceNoDecimal(venta.valor_mensual) }} / mes</span>
    </div>
    <div class="linea linea-secundaria">
      <span>Entidad</span>
      <span>{{ venta.entidad?.nombre }}</span>
    </div>
    <div v-if="venta.aliado?.nombre" class="linea linea-secundaria">
      <span>Asesor</span>
      <span>{{ venta.aliado.nombre }}</span>
    </div>
    <div class="linea linea-secundaria">
      <span>Periodo</span>
      <span>{{ venta.periodo_meses }} {{ venta.periodo_meses === 1 ? 'mes' : 'meses' }}</span>
    </div>
    <div class="linea linea-secundaria">
      <span>Vigencia</span>
      <span>{{ formatearFecha(venta.fecha_inicio) }} – {{ formatearFecha(venta.fecha_fin) }}</span>
    </div>

    <div class="separador"></div>

    <div class="linea linea-total">
      <span>Total</span>
      <span class="monto">{{ formatPriceNoDecimal(venta.valor_total) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPriceNoDecimal } from '../shared/priceFormat';
import { formatearFechaSinHora as formatearFecha } from '../shared/datesFormat';
import type { VentaConvenioDetalle } from '../services/ventas-convenios.service';

defineProps<{ venta: VentaConvenioDetalle }>();
</script>

<style scoped>
.desglose {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
}

.desglose-titulo {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
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
</style>
