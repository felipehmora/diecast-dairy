import { useState, useEffect, useRef } from "react";
import { Plus, FileDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollectionHeader } from "@/components/CollectionHeader";
import { CarForm } from "@/components/CarForm";
import { CarGrid } from "@/components/CarGrid";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import * as ExcelJS from "exceljs";
import Papa from "papaparse";

export interface Car {
  id: string;
  model: string;
  color: string;
  year: string;
  condition: string;
  set: string;
  quantity: number;
  photo?: string;
  createdAt: string;
}

const Index = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedCars = localStorage.getItem("carCollection");
    if (savedCars) {
      setCars(JSON.parse(savedCars));
    }
  }, []);

  const saveCars = (updatedCars: Car[]) => {
    localStorage.setItem("carCollection", JSON.stringify(updatedCars));
    setCars(updatedCars);
  };

  const handleAddCar = (carData: Omit<Car, "id" | "createdAt">) => {
    const newCar: Car = {
      ...carData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updatedCars = [newCar, ...cars];
    saveCars(updatedCars);
    setIsDialogOpen(false);
    toast.success("Carrito agregado a tu colección");
  };

  const handleDeleteCar = (id: string) => {
    const updatedCars = cars.filter((car) => car.id !== id);
    saveCars(updatedCars);
    toast.success("Carrito eliminado de tu colección");
  };

  const handleEditCar = (updatedCar: Car) => {
    const updatedCars = cars.map((car) => (car.id === updatedCar.id ? updatedCar : car));
    saveCars(updatedCars);
    toast.success("Carrito actualizado");
  };

  const handleExportToExcel = async () => {
    if (cars.length === 0) {
      toast.error("No hay carritos para exportar");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Colección");

    // Definir columnas
    worksheet.columns = [
      { header: "Foto", key: "photo", width: 15 },
      { header: "Modelo", key: "model", width: 20 },
      { header: "Color", key: "color", width: 15 },
      { header: "Año", key: "year", width: 10 },
      { header: "Estado", key: "condition", width: 15 },
      { header: "Set/Colección", key: "set", width: 20 },
      { header: "Cantidad", key: "quantity", width: 10 },
      { header: "Fecha de Creación", key: "createdAt", width: 18 },
    ];

    // Agregar datos y fotos
    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];
      const row = worksheet.addRow({
        photo: "",
        model: car.model,
        color: car.color,
        year: car.year,
        condition: car.condition,
        set: car.set,
        quantity: car.quantity,
        createdAt: new Date(car.createdAt).toLocaleDateString(),
      });

      // Ajustar altura de la fila para la imagen
      row.height = 80;

      // Agregar imagen si existe
      if (car.photo) {
        try {
          const imageId = workbook.addImage({
            base64: car.photo,
            extension: "png",
          });

          worksheet.addImage(imageId, {
            tl: { col: 0, row: i + 1 },
            ext: { width: 100, height: 100 },
          });
        } catch (error) {
          console.error("Error al agregar imagen:", error);
        }
      }
    }

    // Estilizar encabezados
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Generar y descargar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `coleccion-carritos-${new Date().toISOString().split("T")[0]}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast.success("Colección exportada a Excel con fotos");
  };

  const handleImportFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Por favor selecciona un archivo CSV válido");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const importedCars: Car[] = [];
          const errors: string[] = [];

          results.data.forEach((row: any, index: number) => {
            // Validar campos requeridos
            if (!row.Modelo || !row.Color || !row.Año || !row.Estado || !row["Set/Colección"] || !row.Cantidad) {
              errors.push(`Fila ${index + 2}: Faltan campos obligatorios`);
              return;
            }

            const newCar: Car = {
              id: crypto.randomUUID(),
              model: row.Modelo.trim(),
              color: row.Color.trim(),
              year: row.Año.toString().trim(),
              condition: row.Estado.trim(),
              set: row["Set/Colección"].trim(),
              quantity: parseInt(row.Cantidad) || 1,
              photo: row.Foto || undefined,
              createdAt: new Date().toISOString(),
            };

            importedCars.push(newCar);
          });

          if (errors.length > 0) {
            toast.error(`Se encontraron ${errors.length} errores en el archivo`);
            console.error("Errores de importación:", errors);
            return;
          }

          if (importedCars.length === 0) {
            toast.error("No se encontraron carritos válidos en el archivo");
            return;
          }

          // Agregar carritos importados a la colección
          const updatedCars = [...importedCars, ...cars];
          saveCars(updatedCars);
          toast.success(`${importedCars.length} carritos importados exitosamente`);
        } catch (error) {
          console.error("Error al procesar CSV:", error);
          toast.error("Error al procesar el archivo CSV");
        }
      },
      error: (error) => {
        console.error("Error al leer CSV:", error);
        toast.error("Error al leer el archivo CSV");
      },
    });

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <CollectionHeader totalCars={cars.length} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Mi Colección</h2>
            <p className="text-muted-foreground mt-1">
              Administra tus carritos a escala
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-5 w-5" />
              Importar CSV
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImportFromCSV}
              className="hidden"
            />
            
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2"
              onClick={handleExportToExcel}
              disabled={cars.length === 0}
            >
              <FileDown className="h-5 w-5" />
              Exportar a Excel
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
                  <Plus className="h-5 w-5" />
                  Agregar Carrito
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Agregar Nuevo Carrito</DialogTitle>
                </DialogHeader>
                <CarForm onSubmit={handleAddCar} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <CarGrid 
          cars={cars} 
          onDelete={handleDeleteCar}
          onEdit={handleEditCar}
        />
      </main>
    </div>
  );
};

export default Index;
