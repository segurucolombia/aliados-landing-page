export type TCustomerCreate = {
    nombre_empresa: string;
    nit:string;
    nombre_representante: string;
    telefono: string;
    email: string;
    codigo_descuento?: string;
    usuario: string;
    contrasena: string;
    contrasena_confirm: string;
    tipo_id_representante:string;
    numero_doc_representante:string;
}