import type { APIRoute } from 'astro';
import { ubicacionesColombia } from '../../shared/ubicaciones';

interface CiudadResponse {
  id: number;
  nombre: string;
}

interface CiudadesResponse {
  data: CiudadResponse[];
  total: number;
}

// Transformar los datos del formato original al formato requerido
const ciudadesTransformadas = ubicacionesColombia.map((ubicacion) => {
  // Formato original: "Colombia, Departamento, Ciudad"
  // Formato requerido: "Ciudad, Departamento"
  const partes = ubicacion.Nombre.split(', ');
  const departamento = partes[1] || '';
  const ciudad = partes[2] || partes[1] || '';

  return {
    id: parseInt(ubicacion.id),
    nombre: `${ciudad}, ${departamento}`,
  };
});

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const searchParam = url.searchParams.get('search');

    // Validar que limit esté presente
    if (!limitParam) {
      return new Response(
        JSON.stringify({
          message: 'Limit is required',
        }),
        {
          status: 422,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar que limit sea un número
    const limit = parseInt(limitParam);
    if (isNaN(limit)) {
      return new Response(
        JSON.stringify({
          message: 'Limit must be a number',
        }),
        {
          status: 422,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar que limit esté en el rango válido (1-100)
    if (limit < 1 || limit > 100) {
      return new Response(
        JSON.stringify({
          message: 'Limit must be between 1 and 100',
        }),
        {
          status: 422,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar search si está presente
    if (searchParam !== null && searchParam.length < 1) {
      return new Response(
        JSON.stringify({
          message: 'Search must have at least 1 character',
        }),
        {
          status: 422,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Filtrar ciudades según el parámetro de búsqueda (case-insensitive)
    let ciudadesFiltradas = ciudadesTransformadas;
    if (searchParam) {
      const searchLower = searchParam.toLowerCase();
      ciudadesFiltradas = ciudadesTransformadas.filter((ciudad) =>
        ciudad.nombre.toLowerCase().includes(searchLower)
      );
    }

    const total = ciudadesFiltradas.length;

    // Aplicar límite
    const ciudadesLimitadas = ciudadesFiltradas.slice(0, limit);

    const response: CiudadesResponse = {
      data: ciudadesLimitadas,
      total,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error en endpoint de ciudades:', error);
    return new Response(
      JSON.stringify({
        message: 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
