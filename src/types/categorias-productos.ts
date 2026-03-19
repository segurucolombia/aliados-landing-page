export interface ImagenCategoria {
  id: string;
  nombre: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface CategoriaProducto {
  id: string;
  nombre: string;
  estado: boolean;
  imagen_id: string | null;
  imagen: ImagenCategoria | null;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface FindAllCategoriasParams {
  limit?: number;
  offset?: number;
  estado?: boolean;
}

export interface PaginatedCategorias {
  success: boolean;
  data: CategoriaProducto[];
  total: number;
  message: string;
}
