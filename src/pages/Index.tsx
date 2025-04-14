
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchData, DataRecord, ApiResponse } from "@/services/api";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { DataTable } from "@/components/DataTable";
import { DataCard } from "@/components/DataCard";
import { RecordModal } from "@/components/RecordModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Table as TableIcon, Grid3X3 } from "lucide-react";

const Index = () => {
  const isMobile = useIsMobile();
  const [data, setData] = useState<DataRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">(isMobile ? "cards" : "table");
  const [selectedRecord, setSelectedRecord] = useState<DataRecord | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  
  const itemsPerPage = 10;
  
  // Efecto para cambiar la vista por defecto en móvil/escritorio
  useEffect(() => {
    setViewMode(isMobile ? "cards" : "table");
  }, [isMobile]);

  // Efecto para cargar los datos
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result: ApiResponse = await fetchData(searchTerm, currentPage, itemsPerPage);
        
        if (result.list) {
          setData(result.list);
          
          // Calcular el número total de páginas
          if (result.pageInfo) {
            const totalPages = Math.ceil(result.pageInfo.totalRows / itemsPerPage);
            setPageCount(totalPages);
          }
        } else {
          setData([]);
          setPageCount(1);
        }
      } catch (err) {
        setError("Error al cargar los datos. Por favor, intente nuevamente.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentPage, searchTerm]);

  // Función para manejar la búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0); // Volver a la primera página al buscar
  };

  // Función para manejar el cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Función para ver los detalles de un registro
  const handleViewDetails = (record: DataRecord) => {
    setSelectedRecord(record);
    setShowRecordModal(true);
  };
  
  // Determinar columnas para la tabla
  // Esto es dinámico basado en los primeros registros si hay datos disponibles
  const tableColumns = data.length > 0
    ? Object.keys(data[0])
        .filter(key => !["id", "createdAt", "updatedAt"].includes(key))
        .slice(0, 5)  // Limitar a 5 columnas para no sobrecargar la tabla
        .map(key => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
        }))
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="DataVista" />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Explorador de Datos</h1>
            <p className="text-muted-foreground">
              Visualiza y explora registros de tu base de datos
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Registros</CardTitle>
                <CardDescription>
                  {isLoading
                    ? "Cargando datos..."
                    : `Mostrando ${data.length} registros`}
                </CardDescription>
              </div>
              
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "cards")} className="w-[200px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="table" disabled={isLoading}>
                    <TableIcon className="h-4 w-4 mr-2" />
                    Tabla
                  </TabsTrigger>
                  <TabsTrigger value="cards" disabled={isLoading}>
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Tarjetas
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          
          <CardContent>
            <TabsContent value="table" className="mt-0">
              <DataTable
                data={data}
                isLoading={isLoading}
                columns={tableColumns}
                pageCount={pageCount}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>
            
            <TabsContent value="cards" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Cargando datos...</p>
                </div>
              ) : data.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                  <p>No se encontraron registros</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.map((record) => (
                    <DataCard
                      key={record.id}
                      record={record}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </main>
      
      <RecordModal
        record={selectedRecord}
        open={showRecordModal}
        onOpenChange={setShowRecordModal}
      />
    </div>
  );
};

export default Index;
