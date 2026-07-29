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

/** Razón por la que el backend rechaza un cupón al validarlo contra un plan */
export type MotivoCuponInvalido =
    | 'CUPON_NO_EXISTE'
    | 'CUPON_INACTIVO'
    | 'CUPON_NO_APLICA_AL_PLAN';

/** Body de POST /cupones-descuento/validar-cupon */
export interface ValidarCuponInput {
    codigo: string;
    plan_id: string;
}

/** Cupón devuelto por el backend cuando la validación es exitosa */
export interface CuponValidado {
    id: string;
    codigo: string;
    /** Monto fijo a descontar (no es porcentaje) */
    valor: number;
    estado: boolean;
    aliado_id: string | null;
}

export interface ValidarCuponData {
    valido: boolean;
    motivo: MotivoCuponInvalido | null;
    /** Mensaje listo para mostrar al usuario */
    mensaje: string;
    /** Viene en null cuando `valido` es false */
    cupon: CuponValidado | null;
}

export interface ValidarCuponResponse {
    success: boolean;
    message: string;
    data: ValidarCuponData;
}
