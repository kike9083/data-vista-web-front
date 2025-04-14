
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "DataVista" }: HeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="flex gap-2 items-center mr-4">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 pt-4">
                  <a href="/" className="text-sm font-medium px-4 py-2 hover:bg-accent rounded-md">
                    Dashboard
                  </a>
                  <a href="/configuracion" className="text-sm font-medium px-4 py-2 hover:bg-accent rounded-md">
                    Configuración
                  </a>
                  <a href="/ayuda" className="text-sm font-medium px-4 py-2 hover:bg-accent rounded-md">
                    Ayuda
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          )}
          <h1 className="text-lg font-bold">{title}</h1>
        </div>
        {!isMobile && (
          <nav className="mx-4 flex items-center space-x-4 lg:space-x-6">
            <a href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </a>
            <a href="/configuracion" className="text-sm font-medium transition-colors hover:text-primary">
              Configuración
            </a>
            <a href="/ayuda" className="text-sm font-medium transition-colors hover:text-primary">
              Ayuda
            </a>
          </nav>
        )}
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="outline">Conectar API</Button>
        </div>
      </div>
    </header>
  );
}
