
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { DataRecord } from "@/services/api";

interface DataTableProps {
  data: DataRecord[];
  isLoading: boolean;
  columns: {
    key: string;
    label: string;
  }[];
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewDetails: (record: DataRecord) => void;
}

export function DataTable({
  data,
  isLoading,
  columns,
  pageCount,
  currentPage,
  onPageChange,
  onViewDetails,
}: DataTableProps) {
  // Para renderizar el paginado
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    // Lógica para mostrar páginas cercanas a la actual
    let startPage = Math.max(0, Math.min(currentPage - Math.floor(maxVisiblePages / 2), pageCount - maxVisiblePages));
    let endPage = Math.min(startPage + maxVisiblePages, pageCount);
    
    if (endPage - startPage < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages);
    }
    
    for (let i = startPage; i < endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => onPageChange(i)}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  Cargando datos...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  No se encontraron registros
                </TableCell>
              </TableRow>
            ) : (
              data.map((record) => (
                <TableRow key={record.id}>
                  {columns.map((column) => (
                    <TableCell key={`${record.id}-${column.key}`}>
                      {typeof record[column.key] === "string" && 
                       record[column.key].match(/^\d{4}-\d{2}-\d{2}/) ? (
                        new Date(record[column.key]).toLocaleDateString()
                      ) : (
                        record[column.key]?.toString() || "N/A"
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(record)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {pageCount > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
                className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < pageCount - 1 && onPageChange(currentPage + 1)}
                className={currentPage === pageCount - 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
