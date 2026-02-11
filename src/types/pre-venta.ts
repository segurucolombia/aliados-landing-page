export type TCrearPreventaAtt = {
    nombre_empresa?: string;
    nit?: string;
    nombre_representante: string;
    email: string;
    telefono: string;
    usuario: string;
    contrasena: string;
    codigo_descuento?: string;
    numero_alojamientos?: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    precio: number;
    numero_meses?: number;
    public?:string
    advisor_id?:string;
    version_plan_id:string;
    detalle_alojamientos: TPreVentaPlanesDetalleAlojamientos[]
    tipo_documento_representante?:string;
    numero_documento_representante?:string;
    id_preventa?:string;
    prueba_gratuita:boolean;
    datos_adicionales?: import('./planes').CamposAdicionalesCapturados; // Objeto JSON
  }

  export interface TPreVentaPlanesDetalleAlojamientos {
    nombre_alojamiento: string;
    ciudad: string;
    direccion: string;
    tipo_alojamiento: string;
    amenidades?: string; // Campo opcional (nullable)
    capacidad_maxima: number;
    numero_habitaciones:number;
    capacidad_id:string;
  }

export type PlanVersionPreventa = {
  nombre:string;
  plan_id:string;
  id:string;
  documento_id?:string;
  valor_asegurado?:number;
}

export type TGetPreventaAtt = {
    nombre_empresa: string;
    hash:string;
    transaccion_id:string;
    nit: string;
    nombre_representante: string;
    email: string;
    telefono: string;
    usuario: string;
    contrasena: string;
    codigo_descuento?: string;
    numero_alojamientos: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    nombre_plan:string;
    precio: number;
    numero_meses: number;
    id:string;
    created_at:Date;
    updated_at:Date;
    numero_documento_representante:string;
    tipo_documento_representante:string
    advisor_id?:string;
    cliente_id?:string | null;
    plan_version:PlanVersionPreventa | null;
    alojamientos:{
      nombre:string;
      ciudad:string;
      direccion:string;
      tipo:string;
      amenidades:string;
      capacidad_maxima:number;
      numero_habitaciones:number;
      capacidad_id:string;
    }[]
  }

  export type TGetTransactionAtt = {
  id: string;
  state: string;
  amount: number;
  currency: string;
  table_name: string;
  table_id: string;
  created_at: Date;
  updated_at: Date;
}

  