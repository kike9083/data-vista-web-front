
/**
 * Servicio para acceder a los datos de la API de NocoDB
 */

export interface DataRecord {
  id: string;
  [key: string]: any; // Campos dinámicos según la respuesta de la API
}

export interface ApiResponse {
  list: DataRecord[];
  pageInfo?: {
    totalRows: number;
    page: number;
    pageSize: number;
  };
}

/**
 * Obtiene los registros de la API
 * @param search Término de búsqueda opcional
 * @param page Número de página
 * @param limit Límite de registros por página
 * @returns Promesa con los datos
 */
export const fetchData = async (
  search = "",
  page = 0,
  limit = 10
): Promise<ApiResponse> => {
  try {
    const queryParams = new URLSearchParams({
      offset: (page * limit).toString(),
      limit: limit.toString(),
      where: search ? JSON.stringify({ _and: [{ title: { _like: `%${search}%` } }] }) : "",
    }).toString();

    // En producción, esto llamaría al script PHP
    const response = await fetch(`/api/data.php?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener datos');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    // Devuelve un objeto vacío en caso de error
    return { list: [] };
  }
};
