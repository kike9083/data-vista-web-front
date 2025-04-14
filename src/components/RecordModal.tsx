
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataRecord } from "@/services/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Calendar, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecordModalProps {
  record: DataRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecordModal({ record, open, onOpenChange }: RecordModalProps) {
  const [activeTab, setActiveTab] = useState("details");

  if (!record) return null;

  // Formatea las fechas para mostrarlas de manera legible
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Determina el título del registro
  const recordTitle = record.title || record.nombre || record.name || `Registro ${record.id}`;

  // Exportar a CSV
  const exportToCSV = () => {
    const excludeFields = ["id"];
    const headers = Object.keys(record)
      .filter(key => !excludeFields.includes(key))
      .join(",");
    
    const values = Object.keys(record)
      .filter(key => !excludeFields.includes(key))
      .map(key => {
        // Escapar comillas en los valores si los hay
        const value = record[key]?.toString().replace(/"/g, '""') || "";
        return `"${value}"`;
      })
      .join(",");
    
    const csv = `${headers}\n${values}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `registro-${record.id}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">{recordTitle}</DialogTitle>
          <DialogDescription>
            ID: {record.id} • {formatDate(record.createdAt || record.created_at)}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="details" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Detalles
            </TabsTrigger>
            <TabsTrigger value="metadata" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Metadatos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="py-4">
            <ScrollArea className="h-[50vh]">
              <div className="space-y-4">
                {Object.entries(record)
                  .filter(([key]) => !["id", "createdAt", "updatedAt", "created_at", "updated_at"].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground capitalize">
                        {key.replace(/_/g, " ")}
                      </h4>
                      <p className="text-base">
                        {typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/) 
                          ? formatDate(value) 
                          : value?.toString() || "N/A"}
                      </p>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="metadata" className="py-4">
            <ScrollArea className="h-[50vh]">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">ID</h4>
                  <p className="text-base">{record.id}</p>
                </div>
                
                {record.createdAt && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Fecha de creación</h4>
                    <p className="text-base">{formatDate(record.createdAt)}</p>
                  </div>
                )}
                
                {record.updatedAt && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Última actualización</h4>
                    <p className="text-base">{formatDate(record.updatedAt)}</p>
                  </div>
                )}
                
                {/* Campos de metadatos adicionales si existen */}
                {Object.entries(record)
                  .filter(([key]) => key.startsWith("meta_") || key.includes("autor") || key.includes("author"))
                  .map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground capitalize">
                        {key.replace(/_/g, " ").replace("meta_", "")}
                      </h4>
                      <p className="text-base">{value?.toString() || "N/A"}</p>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
