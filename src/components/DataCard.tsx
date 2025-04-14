
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataRecord } from "@/services/api";
import { Eye } from "lucide-react";

interface DataCardProps {
  record: DataRecord;
  onViewDetails: (record: DataRecord) => void;
}

export function DataCard({ record, onViewDetails }: DataCardProps) {
  // Extrae los primeros 3 campos para mostrar en la tarjeta
  const displayFields = Object.entries(record)
    .filter(([key]) => key !== "id" && key !== "createdAt" && key !== "updatedAt")
    .slice(0, 3);

  // Formatea las fechas para mostrarlas de manera legible
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Determina si hay un campo de estado y su valor
  const statusField = Object.entries(record).find(([key]) => 
    key.toLowerCase().includes("status") || key.toLowerCase().includes("estado")
  );
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {record.title || record.nombre || record.name || `Registro ${record.id}`}
          </CardTitle>
          {statusField && (
            <Badge variant={statusField[1] === "active" ? "default" : "secondary"}>
              {statusField[1]}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {displayFields.map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-muted-foreground capitalize">{key}:</span>
              <span className="font-medium truncate max-w-[200px]">
                {typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/) 
                  ? formatDate(value) 
                  : value?.toString() || "N/A"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => onViewDetails(record)}
        >
          <Eye className="mr-2 h-4 w-4" />
          Ver detalles
        </Button>
      </CardFooter>
    </Card>
  );
}
