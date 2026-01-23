export type TFiltrosBuscarCupones = {
    id?: string;
    nombre?: string;
}

export type TCuponAttributes = {
    id: string;
    nombre: string;
    valor: number;
    fecha_expiracion: Date;
    asesor_id?: string;
    estado: boolean;
}
