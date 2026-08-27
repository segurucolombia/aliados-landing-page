<template>
  <div class="desglose">
    <h3 class="desglose-titulo">Detalle de tu compra</h3>

    <!-- No se puede vender con los datos ingresados (422) -->
    <div v-if="rechazos.length > 0" class="desglose-rechazos">
      <p class="rechazos-titulo">{{ mensajeRechazo || 'La venta no se puede realizar con los datos ingresados' }}</p>
      <ul class="rechazos-lista">
        <li v-for="(rechazo, index) in rechazos" :key="`${rechazo.campo_clave}-${index}`">
          <span class="rechazo-campo">{{ rechazo.campo_nombre }}:</span> {{ rechazo.mensaje }}
        </li>
      </ul>
    </div>

    <!-- Error que no es un rechazo: cupón inválido, versión inexistente, red… -->
    <p v-else-if="errorCotizacion" class="desglose-error">{{ errorCotizacion }}</p>

    <template v-else-if="cotizacion">
      <!-- Precio del plan -->
      <div class="linea">
        <span>{{ planNombre || 'Plan seleccionado' }}</span>
        <span class="monto">{{ formatPriceNoDecimal(cotizacion.valor_version) }}</span>
      </div>

      <!-- Cargos adicionales: uno por cada regla que se cumplió -->
      <template v-if="cotizacion.adicionales.length > 0">
        <div class="separador"></div>

        <div
          v-for="(adicional, index) in cotizacion.adicionales"
          :key="`${adicional.campo_clave}-${adicional.numero_registro ?? 0}-${index}`"
          class="linea linea-adicional"
        >
          <span>
            {{ adicional.concepto }}
            <span v-if="adicional.numero_registro != null" class="registro">({{ adicional.numero_registro }})</span>
          </span>
          <span class="monto">{{ formatPriceNoDecimal(adicional.valor) }}</span>
        </div>

        <div class="separador"></div>

        <div class="linea">
          <span>Subtotal adicionales</span>
          <span class="monto">{{ formatPriceNoDecimal(cotizacion.valores_adicionales) }}</span>
        </div>
      </template>

      <!-- Cupón aplicado -->
      <div v-if="cotizacion.valor_descuento > 0" class="linea linea-descuento">
        <span>Cupón {{ cotizacion.codigo_descuento }}</span>
        <span class="monto">- {{ formatPriceNoDecimal(cotizacion.valor_descuento) }}</span>
      </div>

      <div class="separador"></div>

      <div class="linea linea-total">
        <span>TOTAL A PAGAR</span>
        <span class="monto">{{ formatPriceNoDecimal(cotizacion.valor_total) }}</span>
      </div>
    </template>

    <p v-else class="desglose-vacio">Completa el formulario para ver el detalle de tu compra.</p>

    <p v-if="cotizando" class="desglose-cargando">
      <i class="pi pi-spin pi-spinner"></i> Actualizando el valor…
    </p>
  </div>
</template>

<script setup lang="ts">
import type { CotizacionVenta, RechazoVenta } from '../types/cotizacion';
import { formatPriceNoDecimal } from '../shared/priceFormat';

/**
 * Desglose de lo que se le va a cobrar al cliente. Todos los valores vienen de
 * `POST /ventas/cotizar`: acá no se calcula nada, ni siquiera el total.
 */
withDefaults(defineProps<{
  cotizacion: CotizacionVenta | null;
  planNombre?: string;
  cotizando?: boolean;
  rechazos?: RechazoVenta[];
  mensajeRechazo?: string;
  errorCotizacion?: string;
}>(), {
  planNombre: '',
  cotizando: false,
  rechazos: () => [],
  mensajeRechazo: '',
  errorCotizacion: '',
});
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

.linea-adicional {
  color: #92400e;
  font-size: 0.9rem;
}

.linea-descuento {
  color: #047857;
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

.registro {
  color: #6b7280;
  font-size: 0.8rem;
}

.separador {
  border-top: 1px solid #e5e7eb;
  margin: 0.5rem 0;
}

.desglose-rechazos {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1rem;
}

.rechazos-titulo {
  color: #b91c1c;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
}

.rechazos-lista {
  list-style: disc;
  padding-left: 1.25rem;
  color: #7f1d1d;
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.rechazo-campo {
  font-weight: 600;
}

.desglose-error {
  color: #b91c1c;
  font-size: 0.9rem;
  margin: 0;
}

.desglose-vacio {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.desglose-cargando {
  color: #6b7280;
  font-size: 0.8rem;
  margin: 0.75rem 0 0 0;
}
</style>
