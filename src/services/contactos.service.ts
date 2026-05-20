import axios from "axios";

const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/correos/contacto';

export interface ContactoMensajeInput {
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
}

export class ContactosService {
  /**
   * Envía un mensaje de contacto al equipo de Seguru.
   * El backend se encarga de notificar al buzón configurado (ej. contacto@segurucolombia.com).
   */
  static async enviar(data: ContactoMensajeInput): Promise<void> {
    await axios.post(baseUrl, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
