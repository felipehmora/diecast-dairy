import { Car } from "@/pages/Index";
import { CarCard } from "./CarCard";

interface CarGridProps {
  cars: Car[];
  onDelete: (id: string) => void;
  onEdit: (car: Car) => void;
}

export const CarGrid = ({ cars, onDelete, onEdit }: CarGridProps) => {
  if (cars.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Tu colección está vacía
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Comienza agregando tu primer carrito a escala
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cars.map((car) => (
        <CarCard 
          key={car.id} 
          car={car} 
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};
