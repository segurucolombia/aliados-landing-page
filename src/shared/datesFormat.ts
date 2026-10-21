/**
 * Formatea como DD/MM/YYYY una fecha sin hora que llega en ISO (`2026-01-31T00:00:00.000Z`).
 * Se toma solo la parte YYYY-MM-DD: en hora local de Colombia se correría un día atrás.
 */
export const formatearFechaSinHora = (iso: string): string => {
    const [anio, mes, dia] = iso.slice(0, 10).split('-');
    return anio && mes && dia ? `${dia}/${mes}/${anio}` : iso;
}

type FormatDate = 'YYYY/MM/DD' | 'YYYY-MM-DD'

export class FormattingDates {
    format (date:Date, type:FormatDate) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        if (type == 'YYYY/MM/DD') return `${year}/${month}/${day}`;
        if (type == 'YYYY-MM-DD') return `${year}-${month}-${day}`;
    }
    calcularDiasEntreFechas (fechaInicio:Date, fechaFin:Date) {
        const unDiaEnMilisegundos = 1000 * 60 * 60 * 24;
        const diferenciaEnMilisegundos = fechaInicio.getTime() - fechaFin.getTime()
        return Math.round(diferenciaEnMilisegundos / unDiaEnMilisegundos);
    }
    sumarDiasAFecha(fecha: Date, dias: number): Date {
        const nuevaFecha = new Date(fecha);
        nuevaFecha.setDate(nuevaFecha.getDate() + dias);
        return nuevaFecha;
    }
}