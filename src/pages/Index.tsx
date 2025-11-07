import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollectionHeader } from "@/components/CollectionHeader";
import { CarForm } from "@/components/CarForm";
import { CarGrid } from "@/components/CarGrid";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

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
