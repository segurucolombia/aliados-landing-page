import { ref } from 'vue';
import { ClientesService, type ClientePorDocumento } from '../services/clientes.service';

/**
 * Cliente que ya existe con el documento escrito. `nombre`, `correo` y `telefono`
 * llegan enmascarados del backend y se muestran tal cual.
 */
export interface ClienteExistente extends ClientePorDocumento {
  /** `TIPO|NUMERO` con el que se encontró */
  documento: string;
}

const ESPERA_BUSQUEDA_MS = 500;

const claveDocumento = (tipo: string, numero: string): string => `${tipo.trim()}|${numero.trim()}`;

/**
 * Detecta si quien compra ya es cliente, a partir de su tipo y número de documento.
 *
 * El flujo es: `programarBusqueda` al terminar de escribir el documento → si existe,
 * queda en `encontrado` y se pregunta si es esa persona → `confirmar` lo pasa a
 * `confirmado` (se compra con su `cliente_id`) o `descartar` lo olvida y no se vuelve
 * a preguntar por ese documento.
 */
export default function useClienteExistente() {
  const buscando = ref(false);
  /** Cliente encontrado, esperando que la persona confirme que es ella */
  const encontrado = ref<ClienteExistente | null>(null);
  /** Cliente que la persona confirmó */
  const confirmado = ref<ClienteExistente | null>(null);

  /** Documentos con los que la persona dijo "no soy yo" */
  const descartados = new Set<string>();
  /** Último documento consultado: evita repetir la búsqueda */
  let ultimoBuscado = '';
  /** Último documento que se vio en el formulario: avisar dos veces el mismo no cambia nada */
  let documentoActual: string | null = null;
  /** Turno de la búsqueda en curso: la respuesta de una búsqueda vieja se ignora */
  let turno = 0;
  let temporizador: ReturnType<typeof setTimeout> | undefined;

  const buscar = async (tipo: string, numero: string): Promise<void> => {
    const documento = claveDocumento(tipo, numero);
    if (
      documento === ultimoBuscado
      || documento === confirmado.value?.documento
      || descartados.has(documento)
    ) return;

    ultimoBuscado = documento;
    const miTurno = ++turno;
    buscando.value = true;
    try {
      const cliente = await ClientesService.buscarPorDocumento(tipo, numero);
      if (miTurno !== turno) return;
      encontrado.value = cliente ? { ...cliente, documento } : null;
    } catch (error) {
      // No impide la compra: la persona llena sus datos como cliente nuevo
      console.error('Error al buscar el cliente por documento:', error);
      if (miTurno === turno) ultimoBuscado = '';
    } finally {
      if (miTurno === turno) buscando.value = false;
    }
  };

  /** Busca el cliente un momento después del último cambio del documento */
  const programarBusqueda = (tipo: string | null | undefined, numero: string | null | undefined): void => {
    clearTimeout(temporizador);
    if (!tipo?.trim() || !numero?.trim()) return;
    temporizador = setTimeout(() => buscar(tipo, numero), ESPERA_BUSQUEDA_MS);
  };

  const confirmar = (): ClienteExistente | null => {
    confirmado.value = encontrado.value;
    encontrado.value = null;
    return confirmado.value;
  };

  const descartar = (): void => {
    const documento = encontrado.value?.documento ?? confirmado.value?.documento;
    if (documento) descartados.add(documento);
    encontrado.value = null;
    confirmado.value = null;
  };

  /**
   * Vuelve a buscar el documento aunque la persona ya hubiera dicho "no soy yo" con él:
   * el backend confirmó que es de un cliente, así que se le vuelve a preguntar.
   */
  const buscarDeNuevo = (tipo: string | null | undefined, numero: string | null | undefined): void => {
    clearTimeout(temporizador);
    if (!tipo?.trim() || !numero?.trim()) return;
    descartados.delete(claveDocumento(tipo, numero));
    ultimoBuscado = '';
    void buscar(tipo, numero);
  };

  /**
   * El documento del formulario cambió: lo encontrado o confirmado con otro documento
   * deja de valer. Devuelve true si había un cliente confirmado.
   */
  const documentoCambio = (tipo: string | null | undefined, numero: string | null | undefined): boolean => {
    const documento = claveDocumento(tipo ?? '', numero ?? '');
    if (documento === documentoActual) return false;
    documentoActual = documento;

    if (documento !== ultimoBuscado) {
      clearTimeout(temporizador);
      ultimoBuscado = '';
      turno++;
      buscando.value = false;
    }
    if (encontrado.value && encontrado.value.documento !== documento) encontrado.value = null;
    if (confirmado.value && confirmado.value.documento !== documento) {
      confirmado.value = null;
      return true;
    }
    return false;
  };

  return {
    buscando,
    encontrado,
    confirmado,
    programarBusqueda,
    buscarDeNuevo,
    confirmar,
    descartar,
    documentoCambio,
  };
}
