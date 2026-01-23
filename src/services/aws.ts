import axios, { type AxiosResponse } from "axios"
const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/nuevo-back/aws'

export class AwsService {
        // async descargarPdfBlob(id: string):Promise<import("axios").AxiosResponse<Blob>> {
        //     return await axios.get(`${baseUrl}/descargar/${id}`, {
        //         headers: {
        //         Authorization: localStorage.token,
        //         },
        //         responseType: "blob",
        //     });
        // }
        async descargarPdfBlob(id: string): Promise<AxiosResponse<Blob>> {
        try {
            const response = await axios.get(`${baseUrl}/descargar/${id}`, {
                headers: {
                    Authorization: localStorage.token,
                },
                responseType: "blob",
                timeout: 30000, // 30 segundos de timeout
            });

            // Verificar que la respuesta sea un PDF válido
            if (response.data.type && !response.data.type.includes('pdf')) {
                throw new Error('El archivo descargado no es un PDF válido');
            }

            return response;
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            
            // Manejo específico de errores
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    throw new Error('Tiempo de espera agotado. El archivo podría ser muy grande.');
                } else if (error.response?.status === 404) {
                    throw new Error('Archivo no encontrado.');
                } else if (error.response?.status === 403) {
                    throw new Error('Sin permisos para acceder al archivo.');
                } else if ((error.response?.status ?? 0) >= 500) {
                    throw new Error('Error del servidor. Intente más tarde.');
                }
            }
            
            throw error;
        }
    }
}